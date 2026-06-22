import { ERROR_CODE } from '@common/constants/lib/enum/error-code.enum';
import { INVOICE_STATUS } from '@common/constants/lib/enum/invoice.enum';
import { KAFKA_TOPIC } from '@common/constants/lib/enum/kafka-topic.enum';
import { SAGA_TYPE } from '@common/constants/lib/enum/saga.enum';
import { InvoiceSentPayload } from '@common/interfaces/lib/queue/invoice';
import { InvoiceSendSagaContext } from '@common/interfaces/lib/saga/saga-step.interface';
import { CreateInvoiceTCPRequest, SendInvoiceTCPRequest } from '@common/interfaces/lib/tcp/invoice';
import { KafkaService } from '@common/kafka/lib/kafka.service';
import { SagaOrchestrationService } from '@common/saga-orchestration/lib/saga-orchestration.service';
import { Invoice } from '@common/schemas/lib/invoice.schema';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { invoiceRequestMapping } from '../mappers';
import { InvoiceRepository } from '../repositories/invoice.repository';
import { InvoiceSendSagaSteps } from '../sagas/invoice-send-saga-steps.service';

@Injectable()
export class InvoiceService {
  private readonly logger = new Logger(InvoiceSendSagaSteps.name);

  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly kafkaClient: KafkaService,
    private readonly invoiceSendSagaSteps: InvoiceSendSagaSteps,
    private readonly sagaOrchestrator: SagaOrchestrationService,
  ) {}

  create(params: CreateInvoiceTCPRequest) {
    const input = invoiceRequestMapping(params);
    return this.invoiceRepository.create(input);
  }

  async sendById(params: SendInvoiceTCPRequest, processId: string) {
    const { invoiceId, userId } = params;
    const invoice = await this.invoiceRepository.getById(invoiceId);

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${invoiceId} not found`);
    }

    if (invoice.status !== INVOICE_STATUS.CREATED) {
      throw new BadRequestException(ERROR_CODE.INVOICE_CANNOT_BE_SENT);
    }

    // Execute saga
    const context: InvoiceSendSagaContext = {
      sagaId: '',
      invoiceId,
      userId,
      processId,
    };

    const steps = this.invoiceSendSagaSteps.getSteps(invoice);
    try {
      await this.sagaOrchestrator.execute(SAGA_TYPE.INVOICE_SEND, steps, context);

      this.kafkaClient.emit<InvoiceSentPayload>(KAFKA_TOPIC.INVOICE.SENT, {
        data: {
          id: invoiceId,
          paymentLink: context.paymentLink,
        },
        processId,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to send invoice: ${errorMessage}`);
      throw error;
    }
  }

  async updateInvoicePaid(invoiceId: string, processId: string) {
    return this.invoiceRepository.updateById(invoiceId, {
      status: INVOICE_STATUS.PAID,
    });
  }

  async getById(id: string) {
    return this.invoiceRepository.getById(id) as unknown as Invoice;
  }
}
