import { createRouter } from '@/lib/create-app';
import * as handler from '@/routes/user/user.handlers';
import * as routes from '@/routes/user/user.route';

export const user = createRouter()
   .openapi(routes.userMetadata, handler.userMetadata)
   .openapi(routes.userBulkMetadata, handler.userBulkMetadata);
