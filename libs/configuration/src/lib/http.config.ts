import { IsNotEmpty, IsNumber } from 'class-validator';

export enum HTTP_SERVICE_PORTS {
  BFF = 'HTTP_BFF_PORT',
  INVOICE = 'HTTP_INVOICE_PORT',
  PRODUCT = 'HTTP_PRODUCT_PORT',
  USER_ACCESS = 'HTTP_USER_ACCESS_PORT',
  AUTHORIZER = 'HTTP_AUTHORIZER_PORT',
  PDF_GENERATOR = 'HTTP_PDF_GENERATOR_PORT',
  MEDIA = 'HTTP_MEDIA_PORT',
  MAIL = 'HTTP_MAIL_PORT',
}

export class HttpPortConfiguration {
  @IsNotEmpty()
  @IsNumber()
  HTTP_BFF_PORT: number;

  @IsNotEmpty()
  @IsNumber()
  HTTP_INVOICE_PORT: number;

  @IsNotEmpty()
  @IsNumber()
  HTTP_PRODUCT_PORT: number;

  @IsNotEmpty()
  @IsNumber()
  HTTP_USER_ACCESS_PORT: number;

  @IsNotEmpty()
  @IsNumber()
  HTTP_AUTHORIZER_PORT: number;

  @IsNotEmpty()
  @IsNumber()
  HTTP_PDF_GENERATOR_PORT: number;

  @IsNotEmpty()
  @IsNumber()
  HTTP_MEDIA_PORT: number;

  @IsNotEmpty()
  @IsNumber()
  HTTP_MAIL_PORT: number;

  constructor() {
    Object.entries(HTTP_SERVICE_PORTS).forEach(([_, serviceName]) => {
      this[serviceName] = Number(process.env[serviceName]);
    });
  }
}
