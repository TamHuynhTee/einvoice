import { parseToken } from './string.util';
import { type ExtendedRequest } from '@common/interfaces/lib/common';

export function getAccessToken(request: ExtendedRequest, keepBearer = false): string | null {
  const token = request.headers.authorization;
  const accessToken = Array.isArray(token) ? token[0] : token || null;

  return keepBearer ? accessToken : parseToken(accessToken);
}
