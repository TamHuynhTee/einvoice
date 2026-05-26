import { LoginResponseDto } from '../../gateway/authorizer';
import { PERMISSION } from '@common/constants/lib/enum/role.enum';
import { User } from '@common/schemas/lib/user.schema';
import { JwtPayload } from 'jsonwebtoken';

export type LoginTCPResponse = LoginResponseDto;

export class AuthorizedMetadata {
  userId: string | undefined;
  user: User | undefined;
  permissions: PERMISSION[] | undefined;
  jwt: JwtPayload | undefined;

  constructor(init?: Partial<AuthorizedMetadata>) {
    Object.assign(this, init);
  }
}

export class AuthorizeResponse {
  valid = false;
  metadata = new AuthorizedMetadata();

  constructor(init?: Partial<AuthorizeResponse>) {
    Object.assign(this, init);
  }
}
