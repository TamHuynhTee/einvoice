import { v4 } from 'uuid';
import { UnauthorizedException } from '@nestjs/common';

export const getProcessId = (prefix?: string) => (prefix ? `${prefix}-${v4()}` : v4());

export const parseToken = (token: string | null): string => {
  if (!token?.trim()) {
    throw new UnauthorizedException('Token is required');
  }

  if (token.includes(' ')) {
    return token.split(' ')[1];
  }

  return token;
};
