import type { Context, Next } from 'hono';

import jwt from 'jsonwebtoken';

import env from '@/env';

export async function userMiddleware(c: Context, next: Next) {
   const authHeader = c.req.header('Authorization');
   if (!authHeader && !authHeader?.startsWith('Bearer'))
      return c.json({ message: 'Unauthorized' }, 401);

   const token = authHeader.split(' ')[1];

   try {
      const decoded = jwt.verify(token, env.JWT_PASSWORD) as {
         userId: string;
         role: string;
      };

      c.set('userId', decoded.userId);
      await next();
   } catch (error) {
      return c.json({ message: 'Invalid Token' }, 401);
   }
}
