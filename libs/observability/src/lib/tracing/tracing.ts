import { BatchSpanProcessor, NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

export const initTracing = (serviceName: string) => {
  const exporter = new OTLPTraceExporter({
    url: process.env['OTEL_EXPORTER_OTLP_ENDPOINT'] || 'http://localhost:4318/v1/traces',
  });

  const processor = new BatchSpanProcessor(exporter);

  const provider = new NodeTracerProvider({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: serviceName,
    }),
    spanProcessors: [processor],
  });

  const contextManager = new AsyncLocalStorageContextManager();
  contextManager.enable();

  provider.register({
    contextManager,
  });

  registerInstrumentations({
    instrumentations: [getNodeAutoInstrumentations()],
  });

  process.on('SIGTERM', () => {
    provider
      .shutdown()
      .then(() => console.log('Tracing terminated'))
      .catch((e) => console.error('Error terminating tracing', e))
      .finally(() => process.exit(0));
  });
};
