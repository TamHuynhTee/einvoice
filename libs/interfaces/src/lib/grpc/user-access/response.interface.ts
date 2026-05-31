import { User } from '@common/schemas/lib/user.schema';
import { Response } from '../common/response.interface';

export type GetUserByIdResponse = Response<User>;
