import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { ProcessId } from '@common/decorators/processId.decorator';
import { CreateProductRequestDto, ProductResponseDto } from '@common/interfaces/gateway/product';
import { ResponseDTO } from '@common/interfaces/gateway/response.interface';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { ProductTCPResponse, CreateProductTCPRequest } from '@common/interfaces/tcp/product';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { map } from 'rxjs';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(@Inject(TCP_SERVICES.PRODUCT_SERVICE) private readonly productService: TcpClient) {}

  @Post()
  @ApiOkResponse({ type: ResponseDTO<ProductResponseDto> })
  @ApiOperation({ summary: 'Create a new product' })
  create(@Body() data: CreateProductRequestDto, @ProcessId() processId: string) {
    return this.productService
      .send<ProductTCPResponse, CreateProductTCPRequest>(
        { cmd: TCP_REQUEST_MESSAGE.PRODUCT.CREATE },
        {
          processId,
          data,
        },
      )
      .pipe(map((data) => new ResponseDTO(data)));
  }

  @Get()
  @ApiOkResponse({ type: ResponseDTO<ProductResponseDto[]> })
  @ApiOperation({ summary: 'Get all products' })
  getAll(@ProcessId() processId: string) {
    return this.productService
      .send<ProductTCPResponse>(
        { cmd: TCP_REQUEST_MESSAGE.PRODUCT.GET_ALL },
        {
          processId,
        },
      )
      .pipe(map((data) => new ResponseDTO(data)));
  }
}
