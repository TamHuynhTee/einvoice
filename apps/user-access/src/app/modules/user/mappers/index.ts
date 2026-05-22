import { CreateUserTCPRequest } from '@common/interfaces/lib/tcp/user';
import { User } from '@common/schemas/lib/user.schema';
import { ObjectId } from 'mongodb';

export const createUserRequestMapping = (data: CreateUserTCPRequest, userId: string): Partial<User> => {
  return {
    ...data,
    roles: data.roles.map((role) => new ObjectId(role)),
    userId,
  };
};
