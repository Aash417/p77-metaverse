import { createRouter } from '@/lib/create-app';
import * as handler from '@/routes/admin/admin.handlers';
import * as routes from '@/routes/admin/admin.route';

export const admin = createRouter()
   .openapi(routes.createElement, handler.createElement)
   .openapi(routes.updateElement, handler.updateElement)
   .openapi(routes.createAvatar, handler.createAvatar)
   .openapi(routes.createMap, handler.createMap);
