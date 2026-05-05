import { Module } from '@nestjs/common';
import { MongoProvider } from '@common/configuration/lib/mongo.config';
import { InvoiceDestination } from '@common/schemas/lib/invoice.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceController } from './controllers/invoice.controller';
import { InvoiceService } from './services/invoice.service';
import { InvoiceRepository } from './repositories/invoice.repository';

@Module({
  imports: [MongoProvider, MongooseModule.forFeature([InvoiceDestination])],
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoiceRepository],
})
export class InvoiceModule {}
