import { AuthorizeResponse, LoginTCPRequest } from '@common/interfaces/lib/tcp/authorizer';
import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { KeycloakHttpService } from '../../keycloak/services/keycloak-http.service';
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import jwksRsa, { JwksClient } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { TCP_SERVICES } from '@common/configuration/lib/tcp.config';
import { TcpClient } from '@common/interfaces/lib/tcp/common/tcp-client.interface';
import { TCP_REQUEST_MESSAGE } from '@common/constants/lib/enum/tcp-request-message.enum';
import { Role } from '@common/schemas/lib/role.schema';
import { User } from '@common/schemas/lib/user.schema';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class AuthorizerService {
  private readonly logger = new Logger(AuthorizerService.name);
  private jwksClient: JwksClient;

  constructor(
    @Inject(TCP_SERVICES.USER_ACCESS_SERVICE) private readonly userAccessService: TcpClient,
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
      throw new Error('Invalid token structure');
    }

    try {
      const key = await this.jwksClient.getSigningKey(decoded.header.kid);
      const publicKey = key.getPublicKey();

      const verifiedToken = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as JwtPayload;

      if (!verifiedToken.sub) {
        throw new Error('Token does not contain sub claim');
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
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async validateUser(userId: string, processId: string) {
    const user = await this.getUserByUserId(userId, processId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  private async getUserByUserId(userId: string, processId: string) {
    const observable = await this.userAccessService.send<User, string>(TCP_REQUEST_MESSAGE.USER.GET_BY_USER_ID, {
      processId,
      data: userId,
    });
    return firstValueFrom(observable.pipe(map((res) => res.data)));
  }
}
