import { createRoute } from '@hono/zod-openapi';
import * as httpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import { createMessageObjectSchema } from 'stoker/openapi/schemas';

import { createRouter } from '@/lib/create-app';

export const test = createRouter().openapi(
   createRoute({
      tags: ['Index'],
      method: 'get',
      path: '/',
      responses: {
         [httpStatusCodes.OK]: jsonContent(
            createMessageObjectSchema('metaverse http api'),
            'API INDEX',
         ),
      },
   }),

   (c) => {
      return c.json(
         {
            message: 'metaverse http api',
         },
         httpStatusCodes.OK,
      );
   },
);
