import { createRoute } from '@hono/zod-openapi';
import * as httpStatusCode from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createMessageObjectSchema } from 'stoker/openapi/schemas';

import {
   AvatarIdSchema,
   CreateAvatarSchema,
   CreateElementSchema,
   CreateMapSchema,
   ElementIdSchema,
   MapIdSchema,
   UpdateElementSchema,
} from '@/lib/types';

const tags = ['Admin'];

export const createElement = createRoute({
   tags,
   path: '/admin/element',
   method: 'post',
   request: {
      body: jsonContentRequired(CreateElementSchema, 'create an element'),
   },
   responses: {
      [httpStatusCode.OK]: jsonContent(ElementIdSchema, 'OK RESPONSE'),
   },
});

export const updateElement = createRoute({
   tags,
   path: '/admin/element/:elementId',
   method: 'put',
   request: {
      params: ElementIdSchema,
      body: jsonContentRequired(UpdateElementSchema, 'update an element'),
   },
   responses: {
      [httpStatusCode.OK]: jsonContent(
         createMessageObjectSchema('Element updated'),
         'OK RESPONSE',
      ),
   },
});

export const createAvatar = createRoute({
   tags,
   path: '/admin/avatar',
   method: 'post',
   request: {
      body: jsonContentRequired(CreateAvatarSchema, 'create an avatar'),
   },
   responses: {
      [httpStatusCode.OK]: jsonContent(AvatarIdSchema, 'OK RESPONSE'),
   },
});

export const createMap = createRoute({
   tags,
   path: '/admin/map',
   method: 'post',
   request: {
      body: jsonContentRequired(CreateMapSchema, 'create a map'),
   },
   responses: {
      [httpStatusCode.OK]: jsonContent(MapIdSchema, 'OK RESPONSE'),
   },
});

export type CreateElement = typeof createElement;
export type UpdateElement = typeof updateElement;
export type CreateAvatar = typeof createAvatar;
export type CreateMap = typeof createMap;
