import { TCP_REQUEST_MESSAGE } from '@common/constants/lib/enum/tcp-request-message.enum';
import { RequestParams } from '@common/decorators/lib/request-param.decorator';
import { TCPLoggingInterceptor } from '@common/interceptors/lib/tcpLogging.interceptor';
import { Response } from '@common/interfaces/lib/tcp/common/response.interface';
import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RoleService } from '../services/role.service';

@Controller()
@UseInterceptors(TCPLoggingInterceptor)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @MessagePattern({ cmd: TCP_REQUEST_MESSAGE.ROLE.GET_ALL })
  async getAll(): Promise<Response<any>> {
    const result = await this.roleService.getAll();
    return Response.success<any>(result);
  }

  @MessagePattern({ cmd: TCP_REQUEST_MESSAGE.ROLE.GET_BY_NAME })
  async getByName(@RequestParams() data: { name: string }): Promise<Response<any>> {
    const result = await this.roleService.getByName(data.name);
    return Response.success<any>(result);
  }

  @MessagePattern({ cmd: TCP_REQUEST_MESSAGE.ROLE.GET_BY_ID })
  async getById(@RequestParams() data: { id: string }): Promise<Response<any>> {
    const result = await this.roleService.getById(data.id);
    return Response.success<any>(result);
  }
}
