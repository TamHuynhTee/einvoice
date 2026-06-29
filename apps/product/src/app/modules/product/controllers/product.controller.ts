import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { TCPLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { TcpServerTracingInterceptor } from '@common/interceptors/tracing-server.interceptor';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { CreateProductTCPRequest, ProductTCPResponse } from '@common/interfaces/tcp/product';
import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProductService } from '../services/product.service';
@Controller()
@UseInterceptors(TCPLoggingInterceptor, TcpServerTracingInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern({ cmd: TCP_REQUEST_MESSAGE.PRODUCT.CREATE })
  async create(@RequestParams() product: CreateProductTCPRequest): Promise<Response<ProductTCPResponse>> {
    const result = await this.productService.create(product);
    return Response.success<ProductTCPResponse>(result);
  }

  @MessagePattern({ cmd: TCP_REQUEST_MESSAGE.PRODUCT.GET_ALL })
  async getAll(): Promise<Response<ProductTCPResponse[]>> {
    const result = await this.productService.getAll();
    return Response.success<ProductTCPResponse[]>(result);
  }
}
