import type { AppRouteHandler } from '@/lib/types';
import type {
   CreateAvatar,
   CreateElement,
   CreateMap,
   UpdateElement,
} from './admin.route';

export const createElement: AppRouteHandler<CreateElement> = async (c) => {
   return c.json({ message: 'ok' });
};
export const updateElement: AppRouteHandler<UpdateElement> = async (c) => {
   return c.json({ message: 'ok' });
};
export const createAvatar: AppRouteHandler<CreateAvatar> = async (c) => {
   return c.json({ message: 'ok' });
};
export const createMap: AppRouteHandler<CreateMap> = async (c) => {
   return c.json({ message: 'ok' });
};
