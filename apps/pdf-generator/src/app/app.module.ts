import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION } from '../configuration';
import { PdfModule } from './modules/pdf/pdf.module';
import { InvoiceModule } from './modules/invoice/invoice.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => CONFIGURATION],
    }),
    PdfModule,
    InvoiceModule,
  ],
  exports: [],
})
export class AppModule {
  static CONFIGURATION = CONFIGURATION;
}
