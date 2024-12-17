import configureOpenApi from '@/lib/configure-open-api';
import createApp from '@/lib/create-app';
import { admin } from '@/routes/admin/admin.index';
import { index } from '@/routes/index/index';
import { space } from '@/routes/space/space.index';
import { test } from '@/routes/test.index';
import { user } from '@/routes/user/user.index';

const app = createApp();
const routes = [test, index, admin, user, space] as const;

configureOpenApi(app);

routes.forEach((route) => {
   app.route('/', route);
});

export type AppType = (typeof routes)[number];

export default app;
