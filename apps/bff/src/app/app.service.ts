import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): { message: string } {
    throw new BadRequestException('Bad Request Exception');
    return { message: 'Hello API' };
  }
}
