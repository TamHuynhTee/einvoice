import { Module } from '@nestjs/common';
import { PaymentService } from './services/payment.service';
import { PaymentController } from './controllers/payment.controller';
import { StripeService } from './services/stripe.service';

@Module({
  imports: [],
  controllers: [PaymentController],
  providers: [PaymentService, StripeService],
  exports: [PaymentService],
})
export class PaymentModule {}
