import { createRoute } from '@hono/zod-openapi';
import * as httpStatusCode from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import { createMessageObjectSchema } from 'stoker/openapi/schemas';

const tags = ['Admin'];

export const createElement = createRoute({
   tags,
   path: '/admin/element',
   method: 'post',
   responses: {
      [httpStatusCode.OK]: jsonContent(
         createMessageObjectSchema('stoker custom message'),
         'api index',
      ),
   },
});

export const updateElement = createRoute({
   tags,
   path: '/admin/element/:elementId',
   method: 'put',

   responses: {
      [httpStatusCode.OK]: jsonContent(
         createMessageObjectSchema('stoker custom message'),
         'api index',
      ),
   },
});

export const createAvatar = createRoute({
   tags,
   path: '/admin/avatar',
   method: 'post',

   responses: {
      [httpStatusCode.OK]: jsonContent(
         createMessageObjectSchema('stoker custom message'),
         'api index',
      ),
   },
});

export const createMap = createRoute({
   tags,
   path: '/admin/map',
   method: 'post',

   responses: {
      [httpStatusCode.OK]: jsonContent(
         createMessageObjectSchema('stoker custom message'),
         'api index',
      ),
   },
});

export type CreateElement = typeof createElement;
export type UpdateElement = typeof updateElement;
export type CreateAvatar = typeof createAvatar;
export type CreateMap = typeof createMap;
