import { createRoute } from '@hono/zod-openapi';
import * as httpStatusCode from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import { createMessageObjectSchema } from 'stoker/openapi/schemas';

const tags = ['Auth'];

export const signin = createRoute({
   tags,
   path: '/signin',
   method: 'post',
   responses: {
      [httpStatusCode.OK]: jsonContent(
         createMessageObjectSchema('stoker custom message'),
         'api index',
      ),
   },
});

export const signup = createRoute({
   tags,
   path: '/signup',
   method: 'post',

   responses: {
      [httpStatusCode.OK]: jsonContent(
         createMessageObjectSchema('stoker custom message'),
         'api index',
      ),
   },
});

export type SignupRoute = typeof signup;
export type SigninRoute = typeof signin;
