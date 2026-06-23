import { CreateUserRequestDto } from '@common/interfaces/lib/gateway/user';
import { LoginRequestDto, LoginResponseDto } from '@common/interfaces/lib/gateway/authorizer';
import { ROLE_ID } from '@common/constants/lib/enum/role.enum';
import axios from 'axios';

export interface TestUserCredentials {
  email: string;
}

export const getAccessToken = async (): Promise<{ accessToken: string; user: TestUserCredentials }> => {
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = 'Password@123';

  const testUser: CreateUserRequestDto = {
    firstName: 'Test',
    lastName: 'User',
    email: testEmail,
    password: testPassword,
    roles: [ROLE_ID.ADMINISTRATOR],
  };

  // 1. Register user
  try {
    await axios.post('/user', testUser);
  } catch (error: any) {
    console.warn('Registration failed/skipped (user might exist)', error?.response?.data?.message || error?.message);
  }

  // 2. Then login
  try {
    const loginPayload: LoginRequestDto = {
      username: testEmail,
      password: testPassword,
    };

    const res = await axios.post<{ data: LoginResponseDto }>('/authorizer/login', loginPayload);
    const accessToken = res.data.data.accessToken;

    console.log('Access token: ', accessToken);

    if (!accessToken) {
      throw new Error('No access token received');
    }

    return { accessToken, user: { email: testEmail } };
  } catch (error: any) {
    console.error('Login failed', error?.response?.data || error?.message);
    throw error;
  }
};
