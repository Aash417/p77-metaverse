import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as httpStatusCode from 'stoker/http-status-codes';

import { db } from '@/db';
import env from '@/env';
import type { AppRouteHandler } from '@/lib/types';
import type { SigninRoute, SignupRoute } from '@/routes/auth/auth.route';

export const signin: AppRouteHandler<SigninRoute> = async (c) => {
   const body = c.req.valid('json');

   const user = await db.user.findFirst({
      where: {
         username: body.username,
      },
   });
   if (!user)
      return c.json(
         { message: 'user does not exists in database' },
         httpStatusCode.NOT_FOUND,
      );

   const isPasswordValid = await bcrypt.compare(body.password, user.password);
   if (!isPasswordValid)
      return c.json(
         { message: 'Incorrect password' },
         httpStatusCode.UNAUTHORIZED,
      );

   const token = jwt.sign(
      {
         userId: user.id,
         role: user.role,
      },
      env.JWT_PASSWORD,
   );

   return c.json({ token }, httpStatusCode.OK);
};

export const signup: AppRouteHandler<SignupRoute> = async (c) => {
   const body = c.req.valid('json');

   const hashedPassword = await bcrypt.hash(body.password, 10);

   const exists = await db.user.findFirst({
      where: { username: body.username },
   });
   if (exists)
      return c.json(
         { message: 'user already exists' },
         httpStatusCode.UNPROCESSABLE_ENTITY,
      );

   const user = await db.user.create({
      data: {
         ...body,
         password: hashedPassword,
      },
   });
   if (!user)
      return c.json(
         { message: 'Signed up successfully' },
         httpStatusCode.INTERNAL_SERVER_ERROR,
      );

   return c.json({ id: user.id }, httpStatusCode.OK);
};
