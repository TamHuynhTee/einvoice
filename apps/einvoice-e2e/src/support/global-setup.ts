import { waitForPortOpen } from '@nx/node/utils';

/* eslint-disable */
var __TEARDOWN_MESSAGE__: string;

module.exports = async function () {
  // Start services that that the app needs to run (e.g. database, docker-compose, etc.).
  console.log('\nSetting up...\n');

  const host = process.env.HOST ?? 'localhost';
  const port = process.env.PORT ? Number(process.env.PORT) : 3300;
  const tcpPorts = [
    Number(process.env.TCP_INVOICE_SERVICE_PORT) || 3201,
    Number(process.env.TCP_USER_ACCESS_SERVICE_PORT) || 3203,
    Number(process.env.TCP_AUTHORIZER_SERVICE_PORT) || 3204,
    Number(process.env.TCP_PDF_GENERATOR_SERVICE_PORT) || 3205,
    Number(process.env.TCP_MEDIA_SERVICE_PORT) || 3206,
  ];

  await Promise.all([
    waitForPortOpen(port, { host }),
    ...tcpPorts.map((tcpPort) => waitForPortOpen(tcpPort, { host })),
  ]);

  // Hint: Use `globalThis` to pass variables to global teardown.
  globalThis.__TEARDOWN_MESSAGE__ = '\nTearing down...\n';
};
