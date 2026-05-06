import { TCPLoggingInterceptor } from '@common/interceptors/lib/tcpLogging.interceptor';
import { Controller, UseInterceptors } from '@nestjs/common';
import { ProductService } from '../services/product.service';

@Controller()
@UseInterceptors(TCPLoggingInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}
}
