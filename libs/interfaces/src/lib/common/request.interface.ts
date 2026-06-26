import { MetadataKeys } from '@common/constants/common.constants';
import { type Request as ExpressRequest } from 'express';
import { AuthorizeResponse } from '../tcp/authorizer';

// Extend Express Request to include custom metadata for process ID and start time
export interface ExtendedRequest extends ExpressRequest {
  [MetadataKeys.PROCESS_ID]: string;
  [MetadataKeys.START_TIME]: number;

  user?: AuthorizeResponse;
}
