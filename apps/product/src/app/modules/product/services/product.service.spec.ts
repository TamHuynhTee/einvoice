import { Test, TestingModule } from '@nestjs/testing';
import { ProductRepository } from '../repositories/product.repository';
import { ProductService } from './product.service';
import { CreateProductTCPRequest } from '@common/interfaces/lib/tcp/product';
import { BadRequestException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let repository: ProductRepository;

  const mockProductRepository = {
    exists: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useValue: mockProductRepository,
        },
      ],
      controllers: [],
      exports: [],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<ProductRepository>(ProductRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDTO: CreateProductTCPRequest = {
      sku: 'SKU-001',
      name: 'Test product',
      description: 'Test description',
      price: 100,
      unit: 'pcs',
      vatRate: 10,
    };

    it('should create a product successfully when it does not exist', async () => {
      mockProductRepository.exists.mockResolvedValue(false);
      mockProductRepository.create.mockResolvedValue({
        id: 1,
        ...createDTO,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create(createDTO);

      expect(repository.exists).toHaveBeenCalledWith(createDTO.sku, createDTO.name);
      expect(repository.create).toHaveBeenCalledWith(createDTO);
      expect(result).toEqual({
        id: 1,
        ...createDTO,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should should throw BadRequestException when product already exists', async () => {
      mockProductRepository.exists.mockResolvedValue(true);

      await expect(service.create(createDTO)).rejects.toThrow(BadRequestException);
      expect(repository.exists).toHaveBeenCalledWith(createDTO.sku, createDTO.name);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('getAll', () => {
    it('should return an array of products', async () => {
      const mockProducts = [
        {
          sku: 'SKU-001',
          name: 'Test product 1',
          description: 'Test description 1',
          price: 100,
          unit: 'pcs',
          vatRate: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          sku: 'SKU-002',
          name: 'Test product 2',
          description: 'Test description 2',
          price: 200,
          unit: 'pcs',
          vatRate: 20,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          sku: 'SKU-003',
          name: 'Test product 3',
          description: 'Test description 3',
          price: 300,
          unit: 'pcs',
          vatRate: 30,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockProductRepository.findAll.mockResolvedValue(mockProducts);

      const result = await service.getAll();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });
  });
});
