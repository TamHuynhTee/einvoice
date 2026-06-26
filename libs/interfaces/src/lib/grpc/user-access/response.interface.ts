import { User } from '@common/schemas/user.schema';
import { Response } from '../common/response.interface';

export type GetUserByIdResponse = Response<User>;
