import { TCP_SERVICES } from '@common/configuration/lib/tcp.config';
import { TCP_REQUEST_MESSAGE } from '@common/constants/lib/enum/tcp-request-message.enum';
import { ProcessId } from '@common/decorators/lib/processId.decorator';
import { CreateInvoiceRequestDto, CreateInvoiceResponseDto } from '@common/interfaces/lib/gateway/invoice';
import { ResponseDTO } from '@common/interfaces/lib/gateway/response.interface';
import { TcpClient } from '@common/interfaces/lib/tcp/common/tcp-client.interface';
import { CreateInvoiceTCPRequest, InvoiceTCPResponse } from '@common/interfaces/lib/tcp/invoice';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { map } from 'rxjs';

@ApiTags('Invoice')
@Controller('invoice')
export class InvoiceController {
  constructor(@Inject(TCP_SERVICES.INVOICE_SERVICE) private readonly invoiceService: TcpClient) {}

  @Post()
  @ApiOkResponse({ type: ResponseDTO<CreateInvoiceResponseDto> })
  @ApiOperation({ summary: 'Create a new invoice' })
  create(@Body() data: CreateInvoiceRequestDto, @ProcessId() processId: string) {
    return this.invoiceService
      .send<InvoiceTCPResponse, CreateInvoiceTCPRequest>(
        { cmd: TCP_REQUEST_MESSAGE.INVOICE.CREATE },
        {
          processId,
          data,
        },
      )
      .pipe(map((data) => new ResponseDTO(data)));
  }
}
