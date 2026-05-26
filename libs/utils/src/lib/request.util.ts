import { MetadataKeys } from '@common/constants/lib/common.constants';
import { parseToken } from './string.util';
import { type ExtendedRequest } from '@common/interfaces/lib/common';
import { AuthorizeResponse } from '@common/interfaces/lib/tcp/authorizer';

export function getAccessToken(request: ExtendedRequest, keepBearer = false): string | null {
  const token = request.headers.authorization;
  const accessToken = Array.isArray(token) ? token[0] : token || null;

  return keepBearer ? accessToken : parseToken(accessToken);
}

export function setUserData(request: ExtendedRequest, userData: AuthorizeResponse): void {
  request[MetadataKeys.USER] = userData;
}
