const LOCAL_HOST = 'localhost';

export const DEFAULT_HTTP_HOST = LOCAL_HOST;
export const DEFAULT_TCP_HOST = LOCAL_HOST;

export const DEFAULT_HTTP_SERVICE_PORT = {
  BFF: 3000,
  INVOICE: 3001,
  PRODUCT: 3002,
  USER_ACCESS: 3003,
};

export const DEFAULT_TCP_SERVICE_PORT = {
  INVOICE: 3201,
  PRODUCT: 3202,
  USER_ACCESS: 3203,
};

export enum MetadataKeys {
  PROCESS_ID = 'processId',
  START_TIME = 'startTime',
}
