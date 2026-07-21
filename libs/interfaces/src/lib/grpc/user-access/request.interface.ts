import { Observable } from 'rxjs';
import { GetUserByIdResponse } from './response.interface';

export type GetUserByIdRequest = {
  userId: string;
  processId: string;
};

export interface UserAccessService {
  getUserById(params: GetUserByIdRequest): Observable<GetUserByIdResponse>;
}
