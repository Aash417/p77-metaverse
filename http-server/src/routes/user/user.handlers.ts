import type { AppRouteHandler } from '@/lib/types';
import type { UserBulkMetadata, UserMetadata } from './user.route';

export const userMetadata: AppRouteHandler<UserMetadata> = async (c) => {
   return c.json({ message: 'ok' });
};

export const userBulkMetadata: AppRouteHandler<UserBulkMetadata> = async (
   c,
) => {
   return c.json({ message: 'ok' });
};
