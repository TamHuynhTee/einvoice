import { TCP_SERVICES } from '@common/configuration/lib/tcp.config';
import { PERMISSION } from '@common/constants/lib/enum/role.enum';
import { TCP_REQUEST_MESSAGE } from '@common/constants/lib/enum/tcp-request-message.enum';
import { Authorization } from '@common/decorators/lib/authorizer.decorator';
import { Permissions } from '@common/decorators/lib/permission.decorator';
import { ProcessId } from '@common/decorators/lib/processId.decorator';
import { UserData } from '@common/decorators/lib/user-data.decorator';
import {
  CreateInvoiceRequestDto,
  CreateInvoiceResponseDto,
  SendInvoiceRequestDto,
  SendInvoiceResponseDto,
} from '@common/interfaces/lib/gateway/invoice';
import { ResponseDTO } from '@common/interfaces/lib/gateway/response.interface';
import { AuthorizedMetadata } from '@common/interfaces/lib/tcp/authorizer';
import { TcpClient } from '@common/interfaces/lib/tcp/common/tcp-client.interface';
import {
  CreateInvoiceTCPRequest,
  InvoiceTCPResponse,
  SendInvoiceTCPRequest,
  SendInvoiceTCPResponse,
} from '@common/interfaces/lib/tcp/invoice';
import { Body, Controller, Inject, Param, Post, UnauthorizedException } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { map } from 'rxjs';

@ApiTags('Invoice')
@Controller('invoice')
export class InvoiceController {
  constructor(@Inject(TCP_SERVICES.INVOICE_SERVICE) private readonly invoiceService: TcpClient) {}

  @Post()
  @ApiOkResponse({ type: ResponseDTO<CreateInvoiceResponseDto> })
  @ApiOperation({ summary: 'Create a new invoice' })
  @Authorization({ secured: true })
  @Permissions([PERMISSION.INVOICE_CREATE, PERMISSION.INVOICE_GET_BY_ID])
  create(@Body() data: CreateInvoiceRequestDto, @ProcessId() processId: string) {
    return this.invoiceService
      .send<InvoiceTCPResponse, CreateInvoiceTCPRequest>(TCP_REQUEST_MESSAGE.INVOICE.CREATE, {
        processId,
        data,
      })
      .pipe(map((data) => new ResponseDTO(data)));
  }

  @Post(':id/send')
  @ApiOkResponse({ type: ResponseDTO<SendInvoiceResponseDto> })
  @ApiOperation({ summary: 'Send an existing invoice' })
  @Authorization({ secured: true })
  @Permissions([PERMISSION.INVOICE_SEND])
  send(@Param('id') id: string, @UserData() userData: AuthorizedMetadata, @ProcessId() processId: string) {
    if (!userData || !userData.userId) {
      throw new UnauthorizedException('User data is missing in the request context');
    }

    return this.invoiceService
      .send<SendInvoiceTCPResponse, SendInvoiceTCPRequest>(TCP_REQUEST_MESSAGE.INVOICE.SEND, {
        processId,
        data: { userId: userData.userId, invoiceId: id },
      })
      .pipe(map((data) => new ResponseDTO(data)));
  }
}
