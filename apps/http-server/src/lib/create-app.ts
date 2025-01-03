import { OpenAPIHono } from '@hono/zod-openapi';
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { notFound, onError, serveEmojiFavicon } from 'stoker/middlewares';
import { defaultHook } from 'stoker/openapi';

import type { AppBinding, AppOpenApi } from '@/lib/types';

import { adminMiddleware } from '@/middlewares/admin-middleware';
import { userMiddleware } from '@/middlewares/user-middleware';

expand(config());

export default function createApp() {
   const app = createRouter();

   app.use(
      cors({
         origin: [
            'http://localhost:5173',
            'http://localhost:3000',
            'http://localhost:4173',
         ],
         credentials: true,
      }),
   );
   app.use(serveEmojiFavicon('🔥'));
   app.use(logger());
   app.use('/user/*', userMiddleware);
   app.use('/space/*', userMiddleware);
   app.use('/admin/*', adminMiddleware);

   // for detailed logs use pino logger.
   // app.use(pinoLogger());

   app.notFound(notFound);
   app.onError(onError);

   return app;
}

export function createRouter() {
   return new OpenAPIHono<AppBinding>({
      strict: false,
      defaultHook,
   });
}

// export function createTestApp(router: AppOpenApi) {
//    const testApp = createApp();
//
//    testApp.route('/', router);
//
//    return testApp;
// }
