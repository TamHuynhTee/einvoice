import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [TcpProvider(TCP_SERVICES.PRODUCT_SERVICE)],
})
export class ProductModule {}
