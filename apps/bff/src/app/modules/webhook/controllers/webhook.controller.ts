import { HTTP_MESSAGE } from '@common/constants/lib/enum/http-message.enum';
import { ProcessId } from '@common/decorators/lib/processId.decorator';
import { ResponseDTO } from '@common/interfaces/lib/gateway/response.interface';
import { Response } from '@common/interfaces/lib/tcp/common/response.interface';
import { BadRequestException, Controller, Headers, Post, RawBodyRequest, Req } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { StripeWebhookService } from '../services/stripe-webhook.service';

@ApiTags('Webhook')
@Controller('webhook')
export class WebhookController {
  constructor(private readonly stripeWebhookService: StripeWebhookService) {}

  @Post('stripe')
  @ApiOkResponse({ type: ResponseDTO<string> })
  @ApiOperation({ summary: 'Stripe webhook' })
  async stripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
    @ProcessId() processId: string,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing Stripe signature');
    }

    if (!req.rawBody) {
      throw new BadRequestException('Missing raw body');
    }

    await this.stripeWebhookService.processWebhook(
      { rawBody: req.rawBody as Buffer<ArrayBufferLike>, signature },
      processId,
    );
    return Response.success<string>(HTTP_MESSAGE.OK);
  }
}
