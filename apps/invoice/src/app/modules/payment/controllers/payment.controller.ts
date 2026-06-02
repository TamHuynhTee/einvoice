import { CreateCheckoutSessionRequest } from '@common/interfaces/lib/common/stripe.interface';
import { Controller, Logger, Post } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern()
  async createCheckoutSession(params: CreateCheckoutSessionRequest) {
    return this.paymentService.createCheckoutSession(params);
  }
}
