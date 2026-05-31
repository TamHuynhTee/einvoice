import { AuthorizeResponse } from '../../tcp/authorizer';
import { Response } from '../common/response.interface';

export type VerifyUserTokenResponse = Response<AuthorizeResponse>;
