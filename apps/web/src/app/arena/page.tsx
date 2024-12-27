'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useGetSpaces } from '@/queries/useGetSpaces';
import Link from 'next/link';

export default function Page() {
   const { data, isLoading } = useGetSpaces();

   if (isLoading) return <div>loading..</div>;

   return (
      <div>
         {data.spaces.map((el: { id: string }) => (
            <Link href={`/space/${el.id}`} key={el.id}>
               <Card className="w-[300px]">
                  <CardContent>{el.id}</CardContent>
               </Card>
            </Link>
         ))}
      </div>
   );
}
