import { TCP_SERVICES, TcpProvider } from '@common/configuration/lib/tcp.config';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ProductController } from './controllers/product.controller';

@Module({
  imports: [ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.PRODUCT_SERVICE)])],
  controllers: [ProductController],
  providers: [],
})
export class ProductModule {}
