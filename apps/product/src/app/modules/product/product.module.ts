import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { ProductRepository } from './repositories/product.repository';
import { TypeORMProvider } from '@common/configuration/lib/typeorm.config';

@Module({
  imports: [TypeORMProvider],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
})
export class ProductModule {}
