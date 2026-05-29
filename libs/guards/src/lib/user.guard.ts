import { TCP_SERVICES } from '@common/configuration/lib/tcp.config';
import { MetadataKeys } from '@common/constants/lib/common.constants';
import { TCP_REQUEST_MESSAGE } from '@common/constants/lib/enum/tcp-request-message.enum';
import { type ExtendedRequest } from '@common/interfaces/lib/common';
import { AuthorizeResponse } from '@common/interfaces/lib/tcp/authorizer';
import { TcpClient } from '@common/interfaces/lib/tcp/common/tcp-client.interface';
import { getAccessToken, setUserData } from '@common/utils/lib/request.util';
import { CanActivate, ExecutionContext, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { createHash } from 'crypto';

@Injectable()
export class UserGuard implements CanActivate {
  private readonly logger = new Logger(UserGuard.name);

  constructor(
    @Inject(TCP_SERVICES.AUTHORIZER_SERVICE) private readonly authorizerClient: TcpClient,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly reflect: Reflector,
  ) {}

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

      const result = await this.verifyUserToken(token, processId);

      if (!result || !result.valid) {
        throw new UnauthorizedException('Token is invalid');
      }

      setUserData(request, result);
      await this.cacheManager.set(cacheKey, result, 30 * 60 * 1000);

      return true;
    } catch (error) {
      this.logger.error({ error });
      throw new UnauthorizedException('Invalid or missing access token');
    }
  }

  private async verifyUserToken(token: string, processId: string) {
    return firstValueFrom(
      this.authorizerClient
        .send<AuthorizeResponse, string>(TCP_REQUEST_MESSAGE.AUTHORIZER.VERIFY_USER_TOKEN, { data: token, processId })
        .pipe(map((response) => response.data)),
    );
  }

  generateTokenCacheKey(token: string): string {
    const hash = createHash('sha256').update(token).digest('hex');
    return `user-token:${hash}`;
  }
}
