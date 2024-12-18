import { createRouter } from '@/lib/create-app';
import * as handler from '@/routes/space/space.handlers';
import * as routes from '@/routes/space/space.route';

export const space = createRouter()
   .openapi(routes.createSpace, handler.createSpace)
   .openapi(routes.removeElement, handler.removeElement)
   .openapi(routes.deleteSpace, handler.deleteSpace)
   .openapi(routes.getAllSpace, handler.getAllSpace)
   .openapi(routes.addElement, handler.addElement)
   .openapi(routes.getSpace, handler.getSpace);
