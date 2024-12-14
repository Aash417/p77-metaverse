import { OpenAPIHono } from '@hono/zod-openapi';
import { logger } from 'hono/logger';
import { notFound, onError, serveEmojiFavicon } from 'stoker/middlewares';
import { defaultHook } from 'stoker/openapi';

import configureOpenApi from '@/lib/configure-open-api';
import index from '@/routes/index.route';

export function createRouter() {
   return new OpenAPIHono({
      strict: false,
      defaultHook,
   });
}

export function createApp() {
   const app = createRouter();

   app.use(serveEmojiFavicon('🔥'));
   app.use(logger());

   // for detailed logs use pino logger.
   // app.use(pinoLogger());

   app.notFound(notFound);
   app.onError(onError);

   return app;
}

const app = createApp();
const routes = [index] as const;

configureOpenApi(app);

routes.forEach((route) => {
   app.route('/', route);
});

export type AppType = (typeof routes)[number];

export default app;
