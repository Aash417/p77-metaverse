import { createRouter } from '@/lib/create-app';
import * as handler from '@/routes/auth/auth.handlers';
import * as routes from '@/routes/auth/auth.route';

export const auth = createRouter()
   .openapi(routes.signin, handler.signin)
   .openapi(routes.signup, handler.signup);
