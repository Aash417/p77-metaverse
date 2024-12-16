import configureOpenApi from '@/lib/configure-open-api';
import createApp from '@/lib/create-app';
import { admin } from '@/routes/admin/admin.index';
import { auth } from '@/routes/auth/auth.index';
import { index } from '@/routes/index.route';
import { space } from '@/routes/space/space.index';
import { user } from '@/routes/user/user.index';

const app = createApp();
const routes = [index, auth, admin, user, space] as const;

configureOpenApi(app);

routes.forEach((route) => {
   app.route('/', route);
});

export type AppType = (typeof routes)[number];

export default app;
