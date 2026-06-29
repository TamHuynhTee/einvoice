import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION } from '../configuration';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { PaymentModule } from './modules/payment/payment.module';
import { LoggerModule } from '@common/observability/logger';
import { MetricModule } from '@common/observability/metrics';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => CONFIGURATION],
    }),
    LoggerModule.forRoot('INVOICE'),
    InvoiceModule,
    PaymentModule,
    MetricModule,
  ],
})
export class AppModule {
  static CONFIGURATION = CONFIGURATION;
}
