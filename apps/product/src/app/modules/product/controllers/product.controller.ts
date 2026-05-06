import { TCPLoggingInterceptor } from '@common/interceptors/lib/tcpLogging.interceptor';
import { Controller, UseInterceptors } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSAGE } from '@common/constants/lib/enum/tcp-request-message.enum';
import { ProductTCPResponse, CreateProductTCPRequest } from '@common/interfaces/lib/tcp/product';
import { Response } from '@common/interfaces/lib/tcp/common/response.interface';
import { RequestParams } from '@common/decorators/lib/request-param.decorator';
@Controller()
@UseInterceptors(TCPLoggingInterceptor)
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
