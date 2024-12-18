import { createRoute } from '@hono/zod-openapi';
import * as httpStatusCode from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import {
   createErrorSchema,
   createMessageObjectSchema,
} from 'stoker/openapi/schemas';

import { notFoundSchema } from '@/lib/constants';
import {
   AddElementSchema,
   CreateSpaceSchema,
   ElementIdSchema,
   GetAllSpacesSchema,
   MySpaceSchema,
   RemoveElementSchema,
   SpaceIdQuerySchema,
   SpaceIdSchema,
} from '@/lib/types';
import { z } from '@hono/zod-openapi';

const tags = ['Space'];

export const createSpace = createRoute({
   tags,
   path: '/space',
   method: 'post',
   request: {
      body: jsonContentRequired(CreateSpaceSchema, 'creating a new space'),
   },
   responses: {
      [httpStatusCode.OK]: jsonContent(SpaceIdSchema, 'OK RESPONSE'),
      [httpStatusCode.NOT_FOUND]: jsonContent(
         createMessageObjectSchema('Map not found'),
         'NOT FOUND',
      ),
      [httpStatusCode.INTERNAL_SERVER_ERROR]: jsonContent(
         createMessageObjectSchema('Failed to create space'),
         'INTERNAL SERVER_ERROR',
      ),
   },
});

export const deleteSpace = createRoute({
   tags,
   path: '/space/{spaceId}',
   method: 'delete',
   request: {
      params: SpaceIdQuerySchema,
   },
   responses: {
      [httpStatusCode.NO_CONTENT]: { description: 'SPACE DELETED' },
      [httpStatusCode.NOT_FOUND]: jsonContent(
         notFoundSchema,
         'SPACE NOT FOUND',
      ),
      [httpStatusCode.UNPROCESSABLE_ENTITY]: jsonContent(
         createErrorSchema(SpaceIdSchema),
         'INVALID ID',
      ),
   },
});

export const getAllSpace = createRoute({
   tags,
   path: '/space/all',
   method: 'get',
   responses: {
      [httpStatusCode.OK]: jsonContent(GetAllSpacesSchema, 'OK RESPONSE'),
   },
});

export const addElement = createRoute({
   tags,
   path: '/space/element',
   method: 'post',
   request: {
      body: jsonContentRequired(AddElementSchema, 'adding element to a space'),
   },
   responses: {
      [httpStatusCode.OK]: jsonContent(
         createMessageObjectSchema('stoker custom message'),
         'OK RESPONSE',
      ),
      [httpStatusCode.NOT_FOUND]: jsonContent(
         notFoundSchema,
         'SPACE NOT FOUND',
      ),

      [httpStatusCode.BAD_REQUEST]: jsonContent(
         createMessageObjectSchema('Point is outside of the boundary'),
         'BAD REQUEST',
      ),
   },
});

export const removeElement = createRoute({
   tags,
   path: '/space/element',
   method: 'delete',
   request: {
      body: jsonContentRequired(
         RemoveElementSchema,
         'remove a element from a space',
      ),
   },
   responses: {
      [httpStatusCode.OK]: jsonContent(
         createMessageObjectSchema('Element deleted'),
         'OK RESPONSE',
      ),
      [httpStatusCode.FORBIDDEN]: jsonContent(
         createMessageObjectSchema('Unauthorized request'),
         'FORBIDDEN',
      ),
      [httpStatusCode.NOT_FOUND]: jsonContent(
         notFoundSchema,
         'ELEMENT NOT FOUND',
      ),
      [httpStatusCode.UNPROCESSABLE_ENTITY]: jsonContent(
         createErrorSchema(ElementIdSchema),
         'INVALID ID',
      ),
   },
});

export const getSpace = createRoute({
   tags,
   path: '/space/:spaceId',
   method: 'get',
   request: {
      params: SpaceIdSchema,
   },
   responses: {
      [httpStatusCode.OK]: jsonContent(MySpaceSchema, 'OK RESPONSE'),
      [httpStatusCode.NOT_FOUND]: jsonContent(
         notFoundSchema,
         'SPACE NOT FOUND',
      ),
   },
});

export type CreateSpace = typeof createSpace;
export type DeleteSpace = typeof deleteSpace;
export type GetAllSpace = typeof getAllSpace;
export type AddElement = typeof addElement;
export type RemoveElement = typeof removeElement;
export type GetSpace = typeof getSpace;
