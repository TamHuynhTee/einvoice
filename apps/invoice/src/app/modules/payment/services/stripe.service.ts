import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateCheckoutSessionRequest } from '@common/interfaces/lib/common/stripe.interface';
import Stripe, { type Stripe as TypeStripe } from 'stripe';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private stripe: TypeStripe;

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_CONFIG.SECRET_KEY') || '';
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2026-05-27.dahlia',
    });
  }

  async createCheckoutSession(params: CreateCheckoutSessionRequest) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card', 'alipay', 'amazon_pay'],
      mode: 'payment',
      success_url: this.configService.get<string>('STRIPE_CONFIG.SUCCESS_URL') || '',
      cancel_url: this.configService.get<string>('STRIPE_CONFIG.CANCEL_URL') || '',
      line_items: params.lineItems.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100, // Strip expects amount in cents
        },
        quantity: item.quantity,
      })),
      customer_email: params.clientEmail,
      metadata: {
        invoiceId: params.invoiceId,
      },
    });

    return {
      url: session.url,
      sessionId: session.id,
    };
  }
}
