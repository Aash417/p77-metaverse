import type { Prisma } from '@prisma/client';

import { z } from 'zod';

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

export type Avatar = z.infer<typeof AvatarSchema>;
