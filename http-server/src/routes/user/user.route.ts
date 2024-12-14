import { createRoute } from '@hono/zod-openapi';
import * as httpStatusCode from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import { createMessageObjectSchema } from 'stoker/openapi/schemas';

const tags = ['User'];

export const userMetadata = createRoute({
   tags,
   path: '/user/metadata',
   method: 'post',
   responses: {
      [httpStatusCode.OK]: jsonContent(
         createMessageObjectSchema('stoker custom message'),
         'api index',
      ),
   },
});

export const userBulkMetadata = createRoute({
   tags,
   path: '/user/metadata/bulk',
   method: 'get',

   responses: {
      [httpStatusCode.OK]: jsonContent(
         createMessageObjectSchema('stoker custom message'),
         'api index',
      ),
   },
});

export type UserMetadata = typeof userMetadata;
export type UserBulkMetadata = typeof userBulkMetadata;
