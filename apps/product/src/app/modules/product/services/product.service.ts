import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { Product } from '@common/entities/lib/product.entity';
import { CreateProductTCPRequest } from '@common/interfaces/lib/tcp/product';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(product: CreateProductTCPRequest): Promise<Product> {
    const logger = new Logger(ProductService.name);
    logger.debug(`Creating product with payload: ${JSON.stringify(product)}`);
    const { sku, name } = product;
    const existingProduct = await this.productRepository.exists(sku, name);
    if (existingProduct) {
      throw new BadRequestException('Product already exists');
    }
    return this.productRepository.create(product);
  }

  async getAll(): Promise<Product[]> {
    return this.productRepository.findAll();
  }
}
