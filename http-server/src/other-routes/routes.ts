import env from '@/env';
import { createRouter } from '@/lib/create-app';
import { AccessToken } from 'livekit-server-sdk';

export const newRoute = createRouter();

newRoute.get('/custom', (c) =>
   c.json({ message: 'This route is not in OpenAPI spec' }),
);

newRoute.get('/token', async (c) => {
   const { room, username } = c.req.query();

   const at = new AccessToken(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET, {
      identity: username,
   });

   at.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true });

   // return NextResponse.json({ token: await at.toJwt() });

   return c.json({ token: await at.toJwt() });
});
