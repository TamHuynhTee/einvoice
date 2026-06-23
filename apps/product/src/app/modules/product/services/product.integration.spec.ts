import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../controllers/product.controller';
import { ProductRepository } from '../repositories/product.repository';
import { ProductService } from './product.service';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@common/entities/lib/product.entity';
import { CreateProductTCPRequest } from '@common/interfaces/lib/tcp/product';
import { HttpStatus } from '@nestjs/common';

describe('Product Integration', () => {
  let controller: ProductController;
  let repository: ProductRepository;
  let postgresContainer: StartedPostgreSqlContainer;

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer('postgres:16-alpine').start();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: postgresContainer.getHost(),
          port: postgresContainer.getPort(),
          username: postgresContainer.getUsername(),
          password: postgresContainer.getPassword(),
          database: postgresContainer.getDatabase(),
          entities: [Product],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Product]),
      ],
      controllers: [ProductController],
      providers: [ProductService, ProductRepository],
      exports: [],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    repository = module.get<ProductRepository>(ProductRepository);
  }, 60000);

  afterAll(async () => {
    await postgresContainer.stop();
  });

  afterEach(async () => {
    const allProducts = await repository.findAll();
    for (const product of allProducts) {
      await repository.delete(product.id);
    }
  });

  it('should be defined for controllers', () => {
    expect(controller).toBeDefined();
  });

  it('should create a product', async () => {
    const createDTO: CreateProductTCPRequest = {
      sku: 'SKU-001',
      name: 'Test product',
      description: 'Test description',
      price: 100,
      unit: 'pcs',
      vatRate: 10,
    };

    const response = await controller.create(createDTO);

    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(response.data).toBeDefined();
    expect(response.data?.name).toBe(createDTO.name);
    expect(response.data?.sku).toBe(createDTO.sku);

    // Check DB
    if (response.data?.id) {
      const savedProduct = await repository.findById(response.data.id);
      expect(savedProduct).toBeDefined();
      expect(savedProduct?.name).toBe(createDTO.name);
    }
  });

  it('should get list of products', async () => {
    await repository.create({
      name: 'Product 1',
      sku: 'SKU-1',
      price: 10,
      unit: 'pcs',
      vatRate: 10,
    });

    await repository.create({
      name: 'Product 2',
      sku: 'SKU-2',
      price: 10,
      unit: 'pcs',
      vatRate: 10,
    });

    const response = await controller.getAll();

    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(response.data).toBeDefined();
    expect(response.data).toHaveLength(2);
    expect(response.data?.find((p) => p.sku === 'SKU-1')).toBeDefined();
    expect(response.data?.find((p) => p.sku === 'SKU-2')).toBeDefined();
  });
});
