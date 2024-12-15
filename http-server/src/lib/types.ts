import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi';
import type { PinoLogger } from 'hono-pino';
import { z } from 'zod';

export interface AppBinding {
   Variables: {
      logger: PinoLogger;
   };
}

export type AppOpenApi = OpenAPIHono<AppBinding>;

export type AppRouteHandler<t extends RouteConfig> = RouteHandler<
   t,
   AppBinding
>;

export const SignupSchema = z.object({
   username: z.string().min(1),
   password: z.string().min(1),
   role: z.enum(['User', 'Admin']).optional(),
});

export const SigninSchema = z.object({
   username: z.string(),
   password: z.string(),
});

export const UpdateMetadataSchema = z.object({
   avatarId: z.string(),
});

export const CreateSpaceSchema = z.object({
   name: z.string(),
   dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
   mapId: z.string().optional(),
});

export const DeleteElementSchema = z.object({
   id: z.string(),
});

export const AddElementSchema = z.object({
   spaceId: z.string(),
   elementId: z.string(),
   x: z.number(),
   y: z.number(),
});

export const CreateElementSchema = z.object({
   imageUrl: z.string(),
   width: z.number(),
   height: z.number(),
   static: z.boolean(),
});

export const UpdateElementSchema = z.object({
   imageUrl: z.string(),
});

export const CreateAvatarSchema = z.object({
   name: z.string(),
   imageUrl: z.string(),
});

export const CreateMapSchema = z.object({
   thumbnail: z.string(),
   dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
   name: z.string(),
   defaultElements: z.array(
      z.object({
         elementId: z.string(),
         x: z.number(),
         y: z.number(),
      }),
   ),
});

declare global {
   namespace Express {
      export interface Request {
         role?: 'Admin' | 'User';
         userId?: string;
      }
   }
}
