import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../common/base-response.dto';

export class CreateUserResponseDto extends BaseResponseDto<string> {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ type: [String] })
  roles: string[];
}
