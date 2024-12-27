import db from '@repo/database/index';

import type { AppRouteHandler } from '@/lib/types';
import type { UserBulkMetadata, UserMetadata } from '@/routes/user/user.route';

export const userMetadata: AppRouteHandler<UserMetadata> = async (c) => {
   const userId = c.get('userId');
   const body = c.req.valid('json');

   await db.user.update({
      where: { id: userId },
      data: { avatarId: body.avatarId },
   });

   return c.json({ message: 'ok', userId });
};

export const userBulkMetadata: AppRouteHandler<UserBulkMetadata> = async (
   c,
) => {
   const { ids } = c.req.valid('query');

   const userIds = ids?.slice(1, ids?.length - 1).split(',');
   const metadata = await db.user.findMany({
      where: {
         id: { in: userIds },
      },
      select: {
         id: true,
         avatar: true,
      },
   });

   const avatars = metadata.map(m => ({
      userId: m.id,
      avatarId: m.avatar?.imageUrl || '',
   }));

   return c.json({ avatars });
};
