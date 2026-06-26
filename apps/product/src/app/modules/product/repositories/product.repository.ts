import { Product } from '@common/entities/product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductRepository {
  constructor(@InjectRepository(Product) private readonly productRepository: Repository<Product>) {}

  async create(product: Partial<Product>): Promise<Product> {
    const entity = this.productRepository.create(product);
    return this.productRepository.save(entity);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findById(id: number): Promise<Product | null> {
    return this.productRepository.findOneBy({ id });
  }

  async update(id: number, product: Partial<Product>): Promise<Product | null> {
    await this.productRepository.update(id, product);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }

  async exists(sku: string, name: string): Promise<boolean> {
    const product = await this.productRepository.findOne({
      where: [{ sku, name }],
    });
    return !!product;
  }
}
