import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { BaseResponseDto } from '../common/base-response.dto';
import { INVOICE_STATUS } from '@common/constants/lib/enum/invoice.enum';

class ClientResponseDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  address: string;
}

class ItemResponseDto {
  @ApiProperty({ type: String })
  productId: ObjectId;

  @ApiProperty()
  name: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  vatRate: number;

  @ApiProperty()
  total: number;
}

export class CreateInvoiceResponseDto extends BaseResponseDto<string> {
  @ApiProperty({ type: ClientResponseDto })
  client: ClientResponseDto;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  vatAmount: number;

  @ApiProperty({ type: String, enum: INVOICE_STATUS })
  status: INVOICE_STATUS;

  @ApiProperty({ type: [ItemResponseDto] })
  items: ItemResponseDto[];

  @ApiPropertyOptional({ type: String })
  supervisorId?: string;

  @ApiPropertyOptional()
  fileUrl?: string;
}

export class SendInvoiceResponseDto extends BaseResponseDto<string> {}
