import type { Context, Next } from 'hono';

import jwt from 'jsonwebtoken';

import env from '@/env';

export async function adminMiddleware(c: Context, next: Next) {
   const authHeader = c.req.header('Authorization');
   if (!authHeader && !authHeader?.startsWith('Bearer'))
      return c.json({ message: 'Unauthorized' }, 401);

   const token = authHeader.split(' ')[1];

   try {
      const decoded = jwt.verify(token, env.JWT_PASSWORD) as {
         userId: string;
         role: string;
      };
      if (decoded.role !== 'Admin')
         return c.json({ message: 'Unauthorized' }, 401);

      c.set('userId', decoded.userId);
      await next();
   } catch (error) {
      return c.json({ message: 'Invalid Token' }, 401);
   }
}

{
   ('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbTRxMWN1MWcwMDAwN2twMHUxNXc1YWVuIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNzM0MjkzMTc0fQ.IidhxGgfU-UzU538I3E7fK5nQsCwGxzMqH7yvxPAJxc');
}
