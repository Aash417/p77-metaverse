import type { Role } from '@prisma/client';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as httpStatusCode from 'stoker/http-status-codes';

import type { AppRouteHandler } from '@/lib/types';
import type {
   GetAllAvatarsRoute,
   GetAllElementsRoutes,
   SigninRoute,
   SignupRoute,
} from '@/routes/index/index.route';

import { db } from '@/db';
import env from '@/env';

export const signin: AppRouteHandler<SigninRoute> = async (c) => {
   const body = c.req.valid('json');

   const user = await db.user.findFirst({
      where: {
         username: body.username,
      },
   });
   if (!user) {
      return c.json(
         { message: 'user does not exists in database' },
         httpStatusCode.NOT_FOUND,
      );
   }

   const isPasswordValid = await bcrypt.compare(body.password, user.password);
   if (!isPasswordValid) {
      return c.json(
         { message: 'Incorrect password' },
         httpStatusCode.UNAUTHORIZED,
      );
   }

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
   if (exists) {
      return c.json(
         { message: 'user already exists' },
         httpStatusCode.UNPROCESSABLE_ENTITY,
      );
   }

   const user = await db.user.create({
      data: {
         username: body.username,
         password: hashedPassword,
         role: body.role as Role,
      },
   });
   if (!user) {
      return c.json(
         { message: 'Signed up successfully' },
         httpStatusCode.INTERNAL_SERVER_ERROR,
      );
   }

   return c.json({ userId: user.id }, httpStatusCode.OK);
};

export const getAllAvatars: AppRouteHandler<GetAllAvatarsRoute> = async (c) => {
   const allAvatars = await db.avatar.findMany();

   return c.json({ avatars: allAvatars }, httpStatusCode.OK);
};

export const getAllElements: AppRouteHandler<GetAllElementsRoutes> = async (
   c,
) => {
   const allElements = await db.element.findMany();

   return c.json({ elements: allElements }, httpStatusCode.OK);
};
