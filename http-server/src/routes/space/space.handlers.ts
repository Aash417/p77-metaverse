import type { AppRouteHandler } from '@/lib/types';
import type {
   CreateElement,
   CreateSpace,
   DeleteElement,
   DeleteSpace,
   GetAllSpace,
   GetSpace,
} from './space.route';

export const createSpace: AppRouteHandler<CreateSpace> = async (c) => {
   return c.json({ message: 'ok' });
};
export const deleteSpace: AppRouteHandler<DeleteSpace> = async (c) => {
   return c.json({ message: 'ok' });
};
export const getAllSpace: AppRouteHandler<GetAllSpace> = async (c) => {
   return c.json({ message: 'ok' });
};
export const createElement: AppRouteHandler<CreateElement> = async (c) => {
   return c.json({ message: 'ok' });
};
export const deleteElement: AppRouteHandler<DeleteElement> = async (c) => {
   return c.json({ message: 'ok' });
};
export const getSpace: AppRouteHandler<GetSpace> = async (c) => {
   return c.json({ message: 'ok' });
};
