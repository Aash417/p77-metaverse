import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi';
import type { PinoLogger } from 'hono-pino';

import { z } from 'zod';

export interface AppBinding {
   Variables: {
      logger: PinoLogger;
      userId: string;
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
   dimensions: z.string().regex(/^\d{1,4}x\d{1,4}$/),
   mapId: z.string().optional(),
});

export const RemoveElementSchema = z.object({
   spaceElementId: z.string(),
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
   dimensions: z.string().regex(/^\d{1,4}x\d{1,4}$/),
   name: z.string(),
   defaultElements: z.array(
      z.object({
         elementId: z.string(),
         x: z.number(),
         y: z.number(),
      }),
   ),
});

export const UserIdsSchema = z.object({
   ids: z.string().openapi({
      param: {
         name: 'ids',
         in: 'path',
         required: true,
      },
      required: ['ids'],
      example: '[4,5,6]',
   }),
});

export const UsersMetaDataSchema = z.object({
   avatars: z.array(
      z.object({
         userId: z.string(),
         avatarId: z.string().nullable().optional(),
      }),
   ),
});

export type UsersMetaData = z.infer<typeof UsersMetaDataSchema>;

export const GetAllSpacesSchema = z.object({
   spaces: z.array(
      z.object({
         id: z.string(),
         name: z.string(),
         dimensions: z.string(),
         thumbnail: z.string().nullable(),
      }),
   ),
});

export const MySpaceSchema = z.object({
   dimensions: z.string(),
   elements: z.array(
      z.object({
         id: z.string(),
         element: z.object({
            id: z.string(),
            imageUrl: z.string(),
            width: z.number(),
            height: z.number(),
            static: z.boolean(),
         }),
         x: z.number(),
         y: z.number(),
      }),
   ),
});

export const ElementIdSchema = z.object({
   elementId: z.string(),
});

export const AvatarIdSchema = z.object({
   avatarId: z.string(),
});

export const MapIdSchema = z.object({
   mapId: z.string(),
});

export const IdsQuerySchema = z.object({
   ids: z.string().openapi({
      param: {
         name: 'ids',
         in: 'query',
      },
   }),
});

export const SpaceIdSchema = z.object({
   spaceId: z.string(),
});

export const SpaceIdQuerySchema = z.object({
   spaceId: z.string().openapi({ param: { name: 'spaceId', in: 'path' } }), // Parameter named "id" in the URL path [1, 3, 10]
});

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum([
   'ReadUncommitted',
   'ReadCommitted',
   'RepeatableRead',
   'Serializable',
]);

export const UserScalarFieldEnumSchema = z.enum([
   'id',
   'username',
   'password',
   'avatarId',
   'role',
]);

export const SpaceScalarFieldEnumSchema = z.enum([
   'id',
   'name',
   'width',
   'height',
   'thumbnail',
   'creatorId',
]);

export const SpaceElementsScalarFieldEnumSchema = z.enum([
   'id',
   'elementId',
   'spaceId',
   'x',
   'y',
]);

export const ElementScalarFieldEnumSchema = z.enum([
   'id',
   'width',
   'height',
   'static',
   'imageUrl',
]);

export const MapScalarFieldEnumSchema = z.enum([
   'id',
   'width',
   'height',
   'name',
   'thumbnail',
]);

export const MapElementsScalarFieldEnumSchema = z.enum([
   'id',
   'mapId',
   'elementId',
   'x',
   'y',
]);

export const AvatarScalarFieldEnumSchema = z.enum(['id', 'imageUrl', 'name']);

export const SortOrderSchema = z.enum(['asc', 'desc']);

export const QueryModeSchema = z.enum(['default', 'insensitive']);

export const NullsOrderSchema = z.enum(['first', 'last']);

export const RoleSchema = z.enum(['Admin', 'User']);

export type RoleType = `${z.infer<typeof RoleSchema>}`;

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
   role: RoleSchema,
   id: z.string().cuid(),
   username: z.string(),
   password: z.string(),
   avatarId: z.string().nullable(),
});

export type User = z.infer<typeof UserSchema>;

/////////////////////////////////////////
// SPACE SCHEMA
/////////////////////////////////////////

export const SpaceSchema = z.object({
   id: z.string().cuid(),
   name: z.string(),
   width: z.number().int(),
   height: z.number().int(),
   thumbnail: z.string().nullable(),
   creatorId: z.string(),
});

export type Space = z.infer<typeof SpaceSchema>;

/////////////////////////////////////////
// SPACE ELEMENTS SCHEMA
/////////////////////////////////////////

export const spaceElementsSchema = z.object({
   id: z.string().cuid(),
   elementId: z.string(),
   spaceId: z.string(),
   x: z.number().int(),
   y: z.number().int(),
});

export type spaceElements = z.infer<typeof spaceElementsSchema>;

/////////////////////////////////////////
// ELEMENT SCHEMA
/////////////////////////////////////////

export const ElementSchema = z.object({
   id: z.string().cuid(),
   width: z.number().int(),
   height: z.number().int(),
   static: z.boolean(),
   imageUrl: z.string(),
});

export const ElementsSchema = z.object({
   elements: z.array(ElementSchema),
});

export type Element = z.infer<typeof ElementSchema>;

/////////////////////////////////////////
// MAP SCHEMA
/////////////////////////////////////////

export const MapSchema = z.object({
   id: z.string().cuid(),
   width: z.number().int(),
   height: z.number().int(),
   name: z.string(),
   thumbnail: z.string(),
});

export type Map = z.infer<typeof MapSchema>;

/////////////////////////////////////////
// MAP ELEMENTS SCHEMA
/////////////////////////////////////////

export const MapElementsSchema = z.object({
   id: z.string().cuid(),
   mapId: z.string(),
   elementId: z.string(),
   x: z.number().int().nullable(),
   y: z.number().int().nullable(),
});

export type MapElements = z.infer<typeof MapElementsSchema>;

/////////////////////////////////////////
// AVATAR SCHEMA
/////////////////////////////////////////

export const AvatarSchema = z.object({
   id: z.string().cuid(),
   imageUrl: z.string().nullable(),
   name: z.string().nullable(),
});

export const AvatarsSchema = z.object({
   avatars: z.array(AvatarSchema),
});

export type Avatar = z.infer<typeof AvatarSchema>;

export type Avatars = Avatar[];
