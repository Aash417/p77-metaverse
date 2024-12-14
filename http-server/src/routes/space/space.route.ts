import { createRoute } from '@hono/zod-openapi';
import * as httpStatusCode from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import { createMessageObjectSchema } from 'stoker/openapi/schemas';

const tags = ['Space'];

export const createSpace = createRoute({
   tags,
   path: '/space',
   method: 'post',
   responses: {
      [httpStatusCode.OK]: jsonContent(
         createMessageObjectSchema('stoker custom message'),
         'api index',
      ),
   },
});

export const deleteSpace = createRoute({
   tags,
   path: '/space/:spaceId',
   method: 'delete',

   responses: {
      [httpStatusCode.OK]: jsonContent(
         createMessageObjectSchema('stoker custom message'),
         'api index',
      ),
   },
});

export const getAllSpace = createRoute({
   tags,
   path: '/space/all',
   method: 'get',

   responses: {
      [httpStatusCode.OK]: jsonContent(
         createMessageObjectSchema('stoker custom message'),
         'api index',
      ),
   },
});

export const createElement = createRoute({
   tags,
   path: '/space/element',
   method: 'post',

   responses: {
      [httpStatusCode.OK]: jsonContent(
         createMessageObjectSchema('stoker custom message'),
         'api index',
      ),
   },
});

export const deleteElement = createRoute({
   tags,
   path: '/space/:elementId',
   method: 'delete',

   responses: {
      [httpStatusCode.OK]: jsonContent(
         createMessageObjectSchema('stoker custom message'),
         'api index',
      ),
   },
});

export const getSpace = createRoute({
   tags,
   path: '/space/:spaceId',
   method: 'get',

   responses: {
      [httpStatusCode.OK]: jsonContent(
         createMessageObjectSchema('stoker custom message'),
         'api index',
      ),
   },
});

export type CreateSpace = typeof createSpace;
export type DeleteSpace = typeof deleteSpace;
export type GetAllSpace = typeof getAllSpace;
export type CreateElement = typeof createElement;
export type DeleteElement = typeof deleteElement;
export type GetSpace = typeof getSpace;
