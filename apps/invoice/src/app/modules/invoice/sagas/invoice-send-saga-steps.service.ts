import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { INVOICE_STATUS } from '@common/constants/enum/invoice.enum';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { InvoiceSendSagaContext, SagaStep, SagaStepResult } from '@common/interfaces/saga/saga-step.interface';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { UploadFileTCPRequest, UploadFileTCPResponse } from '@common/interfaces/tcp/media';
import { GeneratePdfTCPRequest, GeneratePdfTCPResponse } from '@common/interfaces/tcp/pdf-generator';
import { Invoice } from '@common/schemas/invoice.schema';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { firstValueFrom, map } from 'rxjs';
import { PaymentService } from '../../payment/services/payment.service';
import { createCheckoutSessionMapping } from '../mappers';
import { InvoiceRepository } from '../repositories/invoice.repository';

@Injectable()
export class InvoiceSendSagaSteps {
  private readonly logger = new Logger(InvoiceSendSagaSteps.name);

  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly paymentService: PaymentService,
    @Inject(TCP_SERVICES.PDF_GENERATOR_SERVICE) private readonly pdfGeneratorTcpService: TcpClient,
    @Inject(TCP_SERVICES.MEDIA_SERVICE) private readonly mediaTcpService: TcpClient,
  ) {}

  getSteps(invoice: Invoice): SagaStep<InvoiceSendSagaContext>[] {
    return [
      {
        name: 'GENERATE_PDF',
        execute: async (context: InvoiceSendSagaContext): Promise<SagaStepResult> => {
          try {
            this.logger.log(`Generating PDF for invoice ${context.invoiceId}`);

            const pdfBase64 = await firstValueFrom(
              this.pdfGeneratorTcpService
                .send<GeneratePdfTCPResponse, GeneratePdfTCPRequest>(
                  TCP_REQUEST_MESSAGE.PDF_GENERATOR.CREATE_INVOICE_PDF,
                  {
                    data: invoice,
                    processId: context.processId,
                  },
                )
                .pipe(map((data) => data.data)),
            );

            return {
              success: true,
              data: { pdfBase64 },
            };
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Failed to generate PDF: ${errorMessage}`);
            return {
              success: false,
              error: errorMessage,
            };
          }
        },
      },
      {
        name: 'UPLOAD_PDF',
        execute: async (context: InvoiceSendSagaContext): Promise<SagaStepResult> => {
          try {
            this.logger.log(`Uploading PDF for invoice ${context.invoiceId}`);

            if (!context.pdfBase64) throw new NotFoundException('PDF not found in context');

            const fileUrl = await firstValueFrom(
              this.mediaTcpService
                .send<UploadFileTCPResponse, UploadFileTCPRequest>(TCP_REQUEST_MESSAGE.MEDIA.UPLOAD_FILE, {
                  data: {
                    fileBase64: context.pdfBase64,
                    fileName: `invoice-${context.invoiceId}`,
                  },
                  processId: context.processId,
                })
                .pipe(map((data) => data.data)),
            );

            return {
              success: true,
              data: { fileUrl: fileUrl?.url, filePublicId: fileUrl?.publicId },
            };
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Failed to upload PDF: ${errorMessage}`);
            return {
              success: false,
              error: errorMessage,
            };
          }
        },
        compensate: async (context: InvoiceSendSagaContext): Promise<void> => {
          try {
            if (context.filePublicId && context.fileUrl) {
              this.logger.log(`Compensating file upload for invoice ${context.invoiceId}`);
              await firstValueFrom(
                this.mediaTcpService
                  .send(TCP_REQUEST_MESSAGE.MEDIA.DESTROY_FILE, {
                    data: context.filePublicId,
                    processId: context.processId,
                  })
                  .pipe(map((data) => data.data)),
              );
              this.logger.warn(`File deletion implemented. File url: ${context.fileUrl}`);
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Failed to compensate file upload for invoice ${context.invoiceId}`, errorMessage);
          }
        },
      },
      {
        name: 'CREATE_PAYMENT',
        execute: async (context: InvoiceSendSagaContext): Promise<SagaStepResult> => {
          try {
            this.logger.log(`Creating payment session for invoice ${context.invoiceId}`);

            const checkoutData = await this.paymentService.createCheckoutSession(createCheckoutSessionMapping(invoice));

            return {
              success: true,
              data: { paymentLink: checkoutData.url, sessionId: checkoutData.sessionId },
            };
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Failed to create payment session: ${errorMessage}`);
            return {
              success: false,
              error: errorMessage,
            };
          }
        },
        compensate: async (context: InvoiceSendSagaContext): Promise<void> => {
          try {
            if (context.paymentLink && context.sessionId) {
              this.logger.log(`Compensating payment creation for invoice ${context.invoiceId}`);
              this.paymentService.expireCheckoutSession(context.sessionId);
              this.logger.warn(`Payment cancellation implemented. Payment link: ${context.paymentLink}`);
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Failed to compensate payment creation: ${errorMessage}`);
          }
        },
      },
      {
        name: 'UPDATE_INVOICE',
        execute: async (context: InvoiceSendSagaContext): Promise<SagaStepResult> => {
          try {
            this.logger.log(`Updating invoice ${context.invoiceId} status to SENT`);

            await this.invoiceRepository.updateById(context.invoiceId, {
              status: INVOICE_STATUS.SENT,
              supervisorId: new ObjectId(context.userId),
              fileUrl: context.fileUrl,
            });

            return { success: true };
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Failed to update invoice: ${errorMessage}`);
            return {
              success: false,
              error: errorMessage,
            };
          }
        },
        compensate: async (context: InvoiceSendSagaContext): Promise<void> => {
          try {
            this.logger.log(`Compensating invoice update for invoice ${context.invoiceId}`);

            await this.invoiceRepository.updateById(context.invoiceId, {
              status: INVOICE_STATUS.CREATED,
              supervisorId: undefined,
              fileUrl: undefined,
            });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Failed to compensate invoice update: ${errorMessage}`);
          }
        },
      },
    ];
  }
}
