export enum ROLE {
  ADMINISTRATOR = 'ADMINISTRATOR',
  ACCOUNTANT = 'ACCOUNTANT',
}

export enum PERMISSION {
  // INVOICE
  INVOICE_CREATE = 'invoice.create',
  INVOICE_GET_ALL = 'invoice.get_all',
  INVOICE_GET_BY_ID = 'invoice.get_by_id',
  INVOICE_UPDATE = 'invoice.update',
  INVOICE_DELETE = 'invoice.delete',
  INVOICE_SEND = 'invoice.send',
  // PRODUCT
  PRODUCT_CREATE = 'product.create',
  PRODUCT_GET_ALL = 'product.get_all',
  PRODUCT_GET_BY_ID = 'product.get_by_id',
  PRODUCT_UPDATE = 'product.update',
  PRODUCT_DELETE = 'product.delete',
}
