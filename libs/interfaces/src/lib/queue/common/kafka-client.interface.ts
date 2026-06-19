import { Observable } from 'rxjs';
import { RequestType } from './request.interface';

export interface KafkaClient {
  emit<TResult = any, TInput = any>(topic: any, data: RequestType<TInput>): Observable<TResult>;
}
