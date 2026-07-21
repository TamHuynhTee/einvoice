import { HttpStatus } from '@nestjs/common';
import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseDTO<T> {
  @ApiProperty({ type: String })
  message = HTTP_MESSAGE.OK;

  @ApiProperty()
  data?: T;

  @ApiProperty()
  processID?: string;

  @ApiProperty({ type: Number })
  statusCode = HttpStatus.OK;

  @ApiProperty()
  duration?: string;

  constructor(data?: Partial<ResponseDTO<T>>) {
    Object.assign(this, data);
  }
}
