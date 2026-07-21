import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaClient } from '@common/interfaces/queue/common/kafka-client.interface';
import { ClientKafka } from '@nestjs/microservices';
import { RequestType } from '@common/interfaces/queue/common/request.interface';
import { Observable } from 'rxjs';

@Injectable()
export class KafkaService implements OnModuleInit, KafkaClient {
  constructor(private readonly client: ClientKafka) {}

  async onModuleInit() {
    await this.client.connect();
  }

  emit<TResult = any, TInput = any>(topic: any, data: RequestType<TInput>): Observable<TResult> {
    return this.client.emit(topic, data);
  }
}
