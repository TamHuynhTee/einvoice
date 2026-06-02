import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class StripeConfiguration {
  @IsString()
  @IsNotEmpty()
  WEBHOOK_SECRET: string;

  @IsString()
  @IsOptional()
  SECRET_KEY: string;

  @IsString()
  @IsOptional()
  SUCCESS_URL: string;

  @IsString()
  @IsOptional()
  CANCEL_URL: string;

  constructor(data?: Partial<StripeConfiguration>) {
    this.WEBHOOK_SECRET = data?.WEBHOOK_SECRET || process.env['STRIPE_WEBHOOK_SECRET'] || '';
    this.SECRET_KEY = data?.SECRET_KEY || process.env['STRIPE_SECRET_KEY'] || '';
    this.SUCCESS_URL = data?.SUCCESS_URL || process.env['STRIPE_SUCCESS_URL'] || '';
    this.CANCEL_URL = data?.CANCEL_URL || process.env['STRIPE_CANCEL_URL'] || '';
  }
}
