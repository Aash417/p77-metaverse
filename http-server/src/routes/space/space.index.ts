import { createRouter } from '@/lib/create-app';
import * as handler from '@/routes/space/space.handlers';
import * as routes from '@/routes/space/space.route';

export const space = createRouter()
   .openapi(routes.createSpace, handler.createSpace)
   .openapi(routes.deleteSpace, handler.deleteSpace)
   .openapi(routes.getAllSpace, handler.getAllSpace)
   .openapi(routes.createElement, handler.createElement)
   .openapi(routes.deleteElement, handler.deleteElement)
   .openapi(routes.getSpace, handler.getSpace);
