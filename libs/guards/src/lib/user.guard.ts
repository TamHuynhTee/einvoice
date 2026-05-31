import { GRPC_SERVICES } from '@common/configuration/lib/grpc.config';
import { MetadataKeys } from '@common/constants/lib/common.constants';
import { type ExtendedRequest } from '@common/interfaces/lib/common';
import { type AuthorizerService } from '@common/interfaces/lib/grpc/authorizer';
import { AuthorizeResponse } from '@common/interfaces/lib/tcp/authorizer';
import { getAccessToken, setUserData } from '@common/utils/lib/request.util';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CanActivate, ExecutionContext, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientGrpc } from '@nestjs/microservices';
import { Cache } from 'cache-manager';
import { createHash } from 'crypto';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable()
export class UserGuard implements CanActivate {
  private readonly logger = new Logger(UserGuard.name);
  private authorizerService: AuthorizerService;

  constructor(
    @Inject(GRPC_SERVICES.AUTHORIZER_SERVICE) private readonly grpcAuthorizerClient: ClientGrpc,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly reflect: Reflector,
  ) {}

  onModuleInit() {
    this.authorizerService = this.grpcAuthorizerClient.getService<AuthorizerService>('AuthorizerService');
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const authOptions = this.reflect.getAllAndOverride<{ secured: boolean }>(MetadataKeys.SECURED, [
      context.getHandler(),
      context.getClass(),
    ]);

    const req = context.switchToHttp().getRequest<ExtendedRequest>();

    if (!authOptions?.secured) {
      return true;
    }

    return this.verifyToken(req);
  }

  private async verifyToken(request: ExtendedRequest): Promise<boolean> {
    try {
      const token = getAccessToken(request);

      if (!token) {
        throw new UnauthorizedException('Access token is missing');
      }
      const cacheKey = this.generateTokenCacheKey(token);

      const processId = request[MetadataKeys.PROCESS_ID];

      if (!processId) {
        throw new UnauthorizedException('Process ID is missing');
      }

      const cachedResult = await this.cacheManager.get<AuthorizeResponse>(cacheKey);

      if (cachedResult) {
        setUserData(request, cachedResult);
        return true;
      }

      const { data: result } = await firstValueFrom(this.authorizerService.verifyUserToken({ token, processId }));

      this.logger.debug({ message: 'Token verification result', result });

      if (!result || !result.valid) {
        throw new UnauthorizedException('Token is invalid');
      }

      setUserData(request, result);
      await this.cacheManager.set(cacheKey, result, 30 * 60 * 1000);

      return true;
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException('Invalid or missing access token');
    }
  }

  generateTokenCacheKey(token: string): string {
    const hash = createHash('sha256').update(token).digest('hex');
    return `user-token:${hash}`;
  }
}
