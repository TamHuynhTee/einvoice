import { Module } from '@nestjs/common';
import { MongoProvider } from '@common/configuration/lib/mongo.config';
import { InvoiceDestination } from '@common/schemas/lib/invoice.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceController } from './controllers/invoice.controller';
import { InvoiceService } from './services/invoice.service';
import { InvoiceRepository } from './repositories/invoice.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/lib/tcp.config';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    MongoProvider,
    MongooseModule.forFeature([InvoiceDestination]),
    ClientsModule.registerAsync([
      TcpProvider(TCP_SERVICES.PDF_GENERATOR_SERVICE),
      TcpProvider(TCP_SERVICES.MEDIA_SERVICE),
    ]),
    PaymentModule,
    ClientsModule.register([
      {
        name: 'INVOICE_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'invoice-client-id',
            brokers: ['localhost:9092'],
          },
        },
      },
    ]),
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoiceRepository],
})
export class InvoiceModule {}
