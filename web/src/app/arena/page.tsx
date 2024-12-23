'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useGetSpaces } from '@/queries/useGetSpaces';
import Link from 'next/link';

export default function Page() {
   const { data, isLoading } = useGetSpaces();

   if (isLoading) return <div>loading..</div>;

   console.log(data);
   return (
      <div>
         {data.spaces.map((el: any) => (
            <Link href={`/space/${el.id}`}>
               <Card className="w-[300px]">
                  <CardContent>{el.id}</CardContent>
               </Card>
            </Link>
         ))}
      </div>
   );
}
