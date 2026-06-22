import { CreateCheckoutSessionRequest } from '@common/interfaces/lib/common';
import { Injectable, Logger } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(private readonly stripeService: StripeService) {}

  async createCheckoutSession(params: CreateCheckoutSessionRequest) {
    return this.stripeService.createCheckoutSession(params);
  }

  async expireCheckoutSession(sessionId: string) {
    return this.stripeService.expireCheckoutSession(sessionId);
  }
}
