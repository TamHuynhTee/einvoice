import { TCPLoggingInterceptor } from '@common/interceptors/lib/tcpLogging.interceptor';
import { Controller, UseInterceptors } from '@nestjs/common';

@Controller()
@UseInterceptors(TCPLoggingInterceptor)
export class MailController {}
