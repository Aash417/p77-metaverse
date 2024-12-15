import { createRoute } from '@hono/zod-openapi';
import * as httpStatusCode from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createMessageObjectSchema } from 'stoker/openapi/schemas';
import { z } from 'zod';

import { SigninSchema, SignupSchema } from '@/lib/types';

const tags = ['Auth'];

export const signin = createRoute({
   tags,
   path: '/signin',
   method: 'post',
   request: {
      body: jsonContentRequired(SigninSchema, 'Sign in credentials'),
   },
   responses: {
      [httpStatusCode.OK]: jsonContent(
         z.object({
            token: z.string(),
         }),
         'OK_RESPONSE',
      ),
      [httpStatusCode.NOT_FOUND]: jsonContent(
         createMessageObjectSchema('User does not exists'),
         'NOT_FOUND',
      ),
      [httpStatusCode.UNAUTHORIZED]: jsonContent(
         createMessageObjectSchema('Incorrect password'),
         'INVALID_CREDENTIALS',
      ),
   },
});

export const signup = createRoute({
   tags,
   path: '/signup',
   method: 'post',
   request: {
      body: jsonContentRequired(SignupSchema, 'Sign up credentials'),
   },
   responses: {
      [httpStatusCode.OK]: jsonContent(
         z.object({
            id: z.string().cuid(),
         }),
         'OK_RESPONSE',
      ),
      [httpStatusCode.INTERNAL_SERVER_ERROR]: jsonContent(
         createMessageObjectSchema('Unable to signup at the moment'),
         'THE_VALIDATION_ERROR',
      ),
      [httpStatusCode.UNPROCESSABLE_ENTITY]: jsonContent(
         createMessageObjectSchema('User alread exists'),
         'SERVER_ERROR',
      ),
   },
});

export type SignupRoute = typeof signup;
export type SigninRoute = typeof signin;
