import { useToken } from '@/lib/tokenContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useGetSpaces() {
   const { token } = useToken();
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
