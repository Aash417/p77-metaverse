import type { AppRouteHandler } from '@/lib/types';
import type { SigninRoute, SignupRoute } from '@/routes/auth/auth.route';

export const signin: AppRouteHandler<SignupRoute> = async (c) => {
   return c.json({ message: 'ok' });
};

export const signup: AppRouteHandler<SigninRoute> = async (c) => {
   return c.json({ message: 'ok' });
};
