const LOCAL_HOST = 'localhost';

export const DEFAULT_HTTP_HOST = LOCAL_HOST;
export const DEFAULT_TCP_HOST = LOCAL_HOST;

export const DEFAULT_HTTP_SERVICE_PORT = {
  BFF: 3100,
  INVOICE: 3101,
  PRODUCT: 3102,
  USER_ACCESS: 3103,
  AUTHORIZER: 3104,
};

export const DEFAULT_TCP_SERVICE_PORT = {
  INVOICE: 3201,
  PRODUCT: 3202,
  USER_ACCESS: 3203,
  AUTHORIZER: 3204,
};

export enum MetadataKeys {
  PROCESS_ID = 'processId',
  START_TIME = 'startTime',
}
