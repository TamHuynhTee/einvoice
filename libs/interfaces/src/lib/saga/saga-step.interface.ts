// Kết quả của mỗi step
export interface SagaStepResult {
  success: boolean;
  data?: any;
  error?: string;
}

// Định nghĩa một step trong saga
export interface SagaStep<TContext = any> {
  name: string;
  execute: (context: TContext) => Promise<SagaStepResult>;
  compensate?: (context: TContext) => Promise<void>;
}

// Context chung cho saga
export interface SagaContext {
  sagaId: string;
  [key: string]: any;
}

// Context cụ thể cho Invoice Send Saga
export interface InvoiceSendSagaContext extends SagaContext {
  invoiceId: string;
  userId: string;
  processId: string;
  // Step results
  pdfBase64?: string;
  fileUrl?: string;
  filePublicId?: string;
  paymentLink?: string;
  sessionId?: string;
}
