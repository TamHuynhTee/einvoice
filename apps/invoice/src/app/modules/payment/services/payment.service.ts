import { TcpClient } from '@common/interfaces/lib/tcp/common/tcp-client.interface';
import { Injectable, Logger } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreateCheckoutSessionRequest } from '@common/interfaces/lib/common/stripe.interface';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(private readonly stripeService: StripeService) {}

  async createCheckoutSession(params: CreateCheckoutSessionRequest) {
    return this.stripeService.createCheckoutSession(params);
  }
}
