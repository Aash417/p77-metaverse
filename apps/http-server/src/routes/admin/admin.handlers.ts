import db from '@repo/database/index';
import * as httpStatusCode from 'stoker/http-status-codes';

import type {
   CreateAvatar,
   CreateElement,
   CreateMap,
   UpdateElement,
} from '@/routes/admin/admin.route';

import type { AppRouteHandler } from '../../lib/types';

export const createElement: AppRouteHandler<CreateElement> = async (c) => {
   const body = c.req.valid('json');
   const element = await db.element.create({
      data: {
         width: body.width,
         height: body.height,
         static: body.static,
         imageUrl: body.imageUrl,
      },
   });

   return c.json({ elementId: element.id }, httpStatusCode.OK);
};

export const updateElement: AppRouteHandler<UpdateElement> = async (c) => {
   const body = c.req.valid('json');
   const { elementId } = c.req.param();

   await db.element.update({
      where: { id: elementId },
      data: { imageUrl: body.imageUrl },
   });
   return c.json({ message: 'Element updated' });
};

export const createAvatar: AppRouteHandler<CreateAvatar> = async (c) => {
   const body = c.req.valid('json');
   const avatar = await db.avatar.create({
      data: {
         name: body.name,
         imageUrl: body.imageUrl,
      },
   });

   return c.json({ avatarId: avatar.id });
};

export const createMap: AppRouteHandler<CreateMap> = async (c) => {
   const body = c.req.valid('json');

   const map = await db.map.create({
      data: {
         name: body.name,
         width: Number.parseInt(body.dimensions.split('x')[0]),
         height: Number.parseInt(body.dimensions.split('x')[1]),
         thumbnail: body.thumbnail,
         mapElements: {
            create: body.defaultElements.map((e) => ({
               elementId: e.elementId,
               x: e.x,
               y: e.y,
            })),
         },
      },
   });

   return c.json({ mapId: map.id });
};
