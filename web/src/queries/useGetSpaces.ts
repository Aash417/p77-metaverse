'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useGetSpaces() {
   let token: string;
   if (typeof window !== 'undefined') {
      token = window.localStorage.getItem('metaverse_user') ?? '';
   }

   const query = useQuery({
      queryKey: ['spaces'],
      queryFn: async () => {
         const data = await axios.get(`http://localhost:9000/space/all`, {
            headers: {
               authorization: `Bearer ${token}`,
            },
         });

         return data.data;
      },
   });
   return query;
}
