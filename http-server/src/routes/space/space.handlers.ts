import * as httpStatusCode from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';

import { db } from '@/db';
import type { AppRouteHandler } from '@/lib/types';
import type {
   AddElement,
   CreateSpace,
   DeleteSpace,
   GetAllSpace,
   GetSpace,
   RemoveElement,
} from '@/routes/space/space.route';

export const createSpace: AppRouteHandler<CreateSpace> = async (c) => {
   const body = c.req.valid('json');
   const userId = c.get('userId');

   if (!body.mapId) {
      const space = await db.space.create({
         data: {
            name: body.name,
            width: parseInt(body.dimensions.split('x')[0]),
            height: parseInt(body.dimensions.split('x')[0]),
            creatorId: userId,
         },
      });

      return c.json({ spaceId: space.id }, httpStatusCode.OK);
   }

   const map = await db.map.findFirst({
      where: {
         id: body.mapId,
      },
      select: {
         mapElements: true,
         width: true,
         height: true,
      },
   });
   if (!map)
      return c.json({ message: 'Map not found' }, httpStatusCode.NOT_FOUND);

   let space = await db.$transaction(async () => {
      const space = await db.space.create({
         data: {
            name: body.name,
            width: map.width,
            height: map.height,
            creatorId: userId,
         },
      });

      await db.spaceElements.createMany({
         data: map.mapElements.map((e) => ({
            spaceId: space.id,
            elementId: e.elementId,
            x: e.x!,
            y: e.y!,
         })),
      });

      return space;
   });
   if (!space)
      return c.json(
         { message: 'Failed to create space' },
         httpStatusCode.INTERNAL_SERVER_ERROR,
      );

   return c.json({ spaceId: space.id }, httpStatusCode.OK);
};

export const deleteSpace: AppRouteHandler<DeleteSpace> = async (c) => {
   const userId = c.get('userId');
   const { spaceId } = c.req.param();

   const space = await db.space.findUnique({
      where: { id: spaceId },
      select: { creatorId: true },
   });
   if (!space) {
      return c.json(
         { message: HttpStatusPhrases.NOT_FOUND },
         httpStatusCode.NOT_FOUND,
      );
   }

   if (userId !== space?.creatorId)
      return c.json(
         { message: 'Unauthorized to performe this action' },
         httpStatusCode.FORBIDDEN,
      );

   await db.space.delete({
      where: { id: spaceId },
   });

   return c.body(null, httpStatusCode.NO_CONTENT);
};

export const getAllSpace: AppRouteHandler<GetAllSpace> = async (c) => {
   const userId = c.get('userId');

   const spaces = await db.space.findMany({
      where: {
         id: userId,
      },
   });

   return c.json(
      {
         spaces: spaces.map((s) => ({
            id: s.id,
            name: s.name,
            thumbnail: s.thumbnail,
            dimensions: `${s.width}x${s.height}`,
         })),
      },
      httpStatusCode.OK,
   );
};

export const addElement: AppRouteHandler<AddElement> = async (c) => {
   const body = c.req.valid('json');
   const userId = c.get('userId');

   const space = await db.space.findUnique({
      where: {
         id: body.spaceId,
         creatorId: userId,
      },
      select: {
         width: true,
         height: true,
      },
   });
   if (!space) {
      return c.json(
         { message: HttpStatusPhrases.NOT_FOUND },
         httpStatusCode.NOT_FOUND,
      );
   }

   if (
      body.x < 0 ||
      body.y < 0 ||
      body.x > space.width ||
      body.y > space.height
   )
      return c.json(
         { message: 'Point is outside of the boundary' },
         httpStatusCode.BAD_REQUEST,
      );

   await db.spaceElements.create({
      data: {
         spaceId: body.spaceId,
         elementId: body.elementId,
         x: body.x,
         y: body.y,
      },
   });

   return c.json({ message: 'Element added' }, httpStatusCode.OK);
};

export const removeElement: AppRouteHandler<RemoveElement> = async (c) => {
   const body = c.req.valid('json');
   const userId = c.get('userId');

   const spaceElement = await db.spaceElements.findFirst({
      where: { id: body.id },
      include: { space: true },
   });
   if (
      !spaceElement?.space.creatorId ||
      spaceElement.space.creatorId !== userId
   )
      return c.json(
         { message: 'Unauthorized to performe this action' },
         httpStatusCode.FORBIDDEN,
      );

   await db.spaceElements.delete({
      where: { id: body.id },
   });

   return c.json({ message: 'Element deleted' }, httpStatusCode.OK);
};

export const getSpace: AppRouteHandler<GetSpace> = async (c) => {
   const { spaceId } = c.req.param();

   const space = await db.space.findUnique({
      where: { id: spaceId },
      include: {
         elements: {
            include: {
               element: true,
            },
         },
      },
   });

   if (!space)
      return c.json({ message: 'Space not found' }, httpStatusCode.NOT_FOUND);

   const mySpace = {
      dimensions: `${space.width}x${space.height}`,
      elements: space.elements.map((e) => ({
         id: e.id,
         element: {
            id: e.element.id,
            imageUrl: e.element.imageUrl,
            width: e.element.width,
            height: e.element.height,
            static: e.element.static,
         },
         x: e.x,
         y: e.y,
      })),
   };

   return c.json(mySpace, httpStatusCode.OK);
};
