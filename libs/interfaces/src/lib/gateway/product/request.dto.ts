import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductRequestDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  unit: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  vatRate: number;
}
