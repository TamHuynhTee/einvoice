import { PERMISSION } from '@common/constants/lib/enum/role.enum';
import { Reflector } from '@nestjs/core';

export const Permissions = Reflector.createDecorator<PERMISSION[]>();
