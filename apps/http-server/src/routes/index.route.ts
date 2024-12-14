import { createRoute } from '@hono/zod-openapi';
import db from '@repo/database';
import * as httpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import { createMessageObjectSchema } from 'stoker/openapi/schemas';

import { createRouter } from '../app';

const router = createRouter().openapi(
   createRoute({
      tags: ['Index'],
      method: 'get',
      path: '/',
      responses: {
         [httpStatusCodes.OK]: jsonContent(
            createMessageObjectSchema('stoker custom message'),
            'index endpoint',
         ),
      },
   }),

   async (c) => {
      const user = await db.user.findMany();

      return c.json(
         {
            message: 'hono node api',
            user,
         },
         httpStatusCodes.OK,
      );
   },
);

export default router;
