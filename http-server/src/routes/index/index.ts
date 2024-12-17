import { createRouter } from '@/lib/create-app';
import * as handler from '@/routes/index/index.handlers';
import * as routes from '@/routes/index/index.route';

export const index = createRouter()
   .openapi(routes.signin, handler.signin)
   .openapi(routes.signup, handler.signup)
   .openapi(routes.getAllAvatars, handler.getAllAvatars)
   .openapi(routes.getAllElements, handler.getAllElements);
