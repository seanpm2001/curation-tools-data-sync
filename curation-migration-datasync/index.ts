import config from './config';
import * as Sentry from '@sentry/serverless';
import { readClient, writeClient } from './dbClient';

export async function handlerFn(event: any) {
  Sentry.captureMessage(JSON.stringify(event));
  console.log(JSON.stringify(event));

  const readQuery = await (await readClient()).raw("SELECT 'Are we good?'");
  const writeQuery = await (
    await writeClient()
  ).raw("SELECT 'And we are lit!'");
  console.log('read for me:', readQuery[0], 'pretend to write:', writeQuery[0]);
}

Sentry.AWSLambda.init({
  dsn: config.app.sentry.dsn,
  release: config.app.sentry.release,
  environment: config.app.environment,
  serverName: config.app.name,
});

export const handler = Sentry.AWSLambda.wrapHandler(handlerFn);
