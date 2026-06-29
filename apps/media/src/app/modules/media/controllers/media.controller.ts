import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { TCPLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { TcpServerTracingInterceptor } from '@common/interceptors/tracing-server.interceptor';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import {
  DeleteFileTCPRequest,
  DeleteFileTCPResponse,
  UploadFileTCPRequest,
  UploadFileTCPResponse,
} from '@common/interfaces/tcp/media';
import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MediaService } from '../services/media.service';

@Controller()
@UseInterceptors(TCPLoggingInterceptor, TcpServerTracingInterceptor)
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
