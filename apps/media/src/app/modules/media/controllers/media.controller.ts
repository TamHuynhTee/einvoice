import { TCP_REQUEST_MESSAGE } from '@common/constants/lib/enum/tcp-request-message.enum';
import { RequestParams } from '@common/decorators/lib/request-param.decorator';
import { TCPLoggingInterceptor } from '@common/interceptors/lib/tcpLogging.interceptor';
import { Response } from '@common/interfaces/lib/tcp/common/response.interface';
import { UploadFileTCPRequest, UploadFileTCPResponse } from '@common/interfaces/lib/tcp/media';
import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MediaService } from '../services/media.service';

@Controller()
@UseInterceptors(TCPLoggingInterceptor)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.MEDIA.UPLOAD_FILE)
  async uploadFile(@RequestParams() data: UploadFileTCPRequest): Promise<Response<UploadFileTCPResponse>> {
    // Implementation for uploading file
    const result = await this.mediaService.uploadFile(data);
    return Response.success<UploadFileTCPResponse>(result);
  }
}
