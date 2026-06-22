import { Module } from '@nestjs/common';
import { MongoProvider } from '@common/configuration/lib/mongo.config';
import { InvoiceDestination } from '@common/schemas/lib/invoice.schema';
import { KafkaModule } from '@common/kafka/lib/kafka.module';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceController } from './controllers/invoice.controller';
import { InvoiceService } from './services/invoice.service';
import { InvoiceRepository } from './repositories/invoice.repository';
import { ClientsModule } from '@nestjs/microservices';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/lib/tcp.config';
import { PaymentModule } from '../payment/payment.module';
import { QUEUE_SERVICES } from '@common/constants/lib/enum/queue.enum';
import { SagaOrchestrationModule } from '@common/saga-orchestration/lib/saga-orchestration.module';
import { InvoiceSendSagaSteps } from './sagas/invoice-send-saga-steps.service';

@Module({
  imports: [
    MongoProvider,
    MongooseModule.forFeature([InvoiceDestination]),
    ClientsModule.registerAsync([
      TcpProvider(TCP_SERVICES.PDF_GENERATOR_SERVICE),
      TcpProvider(TCP_SERVICES.MEDIA_SERVICE),
    ]),
    PaymentModule,
    KafkaModule.register(QUEUE_SERVICES.INVOICE),
    SagaOrchestrationModule.forRoot(),
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoiceRepository, InvoiceSendSagaSteps],
})
export class InvoiceModule {}
