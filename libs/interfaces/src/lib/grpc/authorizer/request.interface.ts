import { Observable } from 'rxjs';
import { VerifyUserTokenResponse } from './response.interface';

export type VerifyUserTokenRequest = {
  token: string;
  processId: string;
};

export interface AuthorizerService {
  verifyUserToken(params: VerifyUserTokenRequest): Observable<VerifyUserTokenResponse>;
}
