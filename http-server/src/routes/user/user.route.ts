import { createRoute } from '@hono/zod-openapi';
import * as httpStatusCode from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createMessageObjectSchema } from 'stoker/openapi/schemas';

import {
   IdsQuerySchema,
   UpdateMetadataSchema,
   UsersMetaDataSchema,
} from '@/lib/types';

const tags = ['User'];

export const userMetadata = createRoute({
   tags,
   path: '/user/metadata',
   method: 'post',
   request: {
      body: jsonContentRequired(UpdateMetadataSchema, 'avatar id'),
   },
   responses: {
      [httpStatusCode.OK]: jsonContent(
         createMessageObjectSchema('Metadata updated'),
         'OK_RESPONSE',
      ),
   },
});

export const userBulkMetadata = createRoute({
   tags,
   path: '/user/metadata/bulk',
   method: 'get',
   request: {
      query: IdsQuerySchema,
   },
   responses: {
      [httpStatusCode.OK]: jsonContent(UsersMetaDataSchema, 'api index'),
   },
});

export type UserMetadata = typeof userMetadata;
export type UserBulkMetadata = typeof userBulkMetadata;
