import { TCP_REQUEST_MESSAGE } from '@common/constants/lib/enum/tcp-request-message.enum';
import { RequestParams } from '@common/decorators/lib/request-param.decorator';
import { TCPLoggingInterceptor } from '@common/interceptors/lib/tcpLogging.interceptor';
import { Response } from '@common/interfaces/lib/tcp/common/response.interface';
import {
  DeleteFileTCPRequest,
  UploadFileTCPRequest,
  DeleteFileTCPResponse,
  UploadFileTCPResponse,
} from '@common/interfaces/lib/tcp/media';
import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MediaService } from '../services/media.service';
import { HTTP_MESSAGE } from '@common/constants/lib/enum/http-message.enum';

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

  @MessagePattern(TCP_REQUEST_MESSAGE.MEDIA.DESTROY_FILE)
  async deleteFile(@RequestParams() data: DeleteFileTCPRequest): Promise<Response<DeleteFileTCPResponse>> {
    // Implementation for deleting file
    await this.mediaService.deleteFile(data);
    return Response.success<DeleteFileTCPResponse>(HTTP_MESSAGE.DELETED);
  }
}
