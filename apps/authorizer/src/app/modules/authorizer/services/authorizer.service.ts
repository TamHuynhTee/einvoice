import { GRPC_SERVICES } from '@common/configuration/lib/grpc.config';
import { UserAccessService } from '@common/interfaces/lib/grpc/user-access';
import { AuthorizeResponse, LoginTCPRequest } from '@common/interfaces/lib/tcp/authorizer';
import { Role } from '@common/schemas/lib/role.schema';
import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc } from '@nestjs/microservices';
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import jwksRsa, { JwksClient } from 'jwks-rsa';
import { firstValueFrom } from 'rxjs';
import { KeycloakHttpService } from '../../keycloak/services/keycloak-http.service';

@Injectable()
export class AuthorizerService {
  private readonly logger = new Logger(AuthorizerService.name);
  private jwksClient: JwksClient;
  private userAccessService: UserAccessService;

  onModuleInit() {
    this.userAccessService = this.grpcUserAccessClient.getService<UserAccessService>('UserAccessService');
  }

  constructor(
    @Inject(GRPC_SERVICES.USER_ACCESS_SERVICE) private readonly grpcUserAccessClient: ClientGrpc,
    private readonly keycloakHttpService: KeycloakHttpService,
    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get<string>('KEYCLOAK_CONFIG.HOST');
    const realm = this.configService.get<string>('KEYCLOAK_CONFIG.REALM');
    this.jwksClient = jwksRsa({
      jwksUri: `${host}/realms/${realm}/protocol/openid-connect/certs`,
      cache: true,
      rateLimit: true,
    });
  }

  async login(params: LoginTCPRequest) {
    const { username, password } = params;
    const { access_token: accessToken, refresh_token: refreshToken } = await this.keycloakHttpService.exchangeUserToken(
      { username, password },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyUserToken(token: string, processId: string): Promise<AuthorizeResponse> {
    const decoded = jwt.decode(token, { complete: true }) as Jwt;
    if (!decoded || !decoded.header || !decoded.header.kid) {
      throw new UnauthorizedException('Invalid token structure');
    }

    try {
      const key = await this.jwksClient.getSigningKey(decoded.header.kid);
      const publicKey = key.getPublicKey();

      const verifiedToken = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as JwtPayload;

      if (!verifiedToken.sub) {
        throw new UnauthorizedException('Token does not contain sub claim');
      }

      const user = await this.validateUser(verifiedToken.sub, processId);

      return {
        valid: true,
        metadata: {
          jwt: verifiedToken,
          permissions: (user.roles as unknown as Role[]).map((r) => r.permissions).flat() || [],
          userId: user.id,
          user,
        },
      };
    } catch (error) {
      this.logger.error({ error });
      throw error;
    }
  }

  private async validateUser(userId: string, processId: string) {
    const { data: user } = await firstValueFrom(this.userAccessService.getUserById({ userId, processId }));

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
