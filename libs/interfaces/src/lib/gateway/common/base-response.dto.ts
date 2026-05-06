import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto<T = string | number> {
  @ApiProperty()
  id: T;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
