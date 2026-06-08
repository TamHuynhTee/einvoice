import { TCP_SERVICES } from '@common/configuration/lib/tcp.config';
import { TCP_REQUEST_MESSAGE } from '@common/constants/lib/enum/tcp-request-message.enum';
import { TcpClient } from '@common/interfaces/lib/tcp/common/tcp-client.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map } from 'rxjs';
import Stripe, { type Checkout, type Stripe as TypeStripe } from 'stripe';

@Injectable()
export class StripeWebhookService {
  private readonly logger = new Logger(StripeWebhookService.name);
  private stripe: TypeStripe;

  private readonly stripeConfig = (key: string) => {
    const secretKey = this.configService.get(`STRIPE_CONFIG.${key}`);
    if (!secretKey) {
      throw new Error(`Stripe ${key} is not configured`);
    }
    return secretKey;
  };

  constructor(
    private configService: ConfigService,
    @Inject(TCP_SERVICES.INVOICE_SERVICE) private readonly invoiceClient: TcpClient,
  ) {
    this.stripe = new Stripe(this.stripeConfig('SECRET_KEY'), {
      apiVersion: '2026-05-27.dahlia',
    });
  }

  async processWebhook(params: { signature: string; rawBody: Buffer<ArrayBufferLike> }, processId: string) {
    const { rawBody, signature } = params;

    const event = this.verifyWebhookSignature(rawBody, signature);
    this.logger.log(`Received Stripe event ${event.type}`);
    this.logger.debug(JSON.stringify(event, null, 2));

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Checkout.Session;

        if (session.metadata?.invoiceId) {
          this.logger.log(`Payment received for invoice ${session.metadata.invoiceId}`);
          await this.updateInvoicePaid({ invoiceId: session.metadata.invoiceId }, processId);
        }

        break;
      }

      default:
        this.logger.log(`Unhandled event type ${event.type}`);
    }
  }

  verifyWebhookSignature(body: Buffer<ArrayBufferLike>, signature: string) {
    return this.stripe.webhooks.constructEvent(body, signature, this.stripeConfig('WEBHOOK_SECRET'));
  }

  updateInvoicePaid(params: { invoiceId: string }, processId: string) {
    const { invoiceId } = params;

    return firstValueFrom(
      this.invoiceClient
        .send<string, string>(TCP_REQUEST_MESSAGE.INVOICE.UPDATE_INVOICE_PAID, {
          data: invoiceId,
          processId,
        })
        .pipe(map((data) => data.data)),
    );
  }
}
