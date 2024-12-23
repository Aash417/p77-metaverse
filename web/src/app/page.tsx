import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
   return (
      <div className="flex h-screen flex-col items-center justify-center gap-12">
         <h1 className="text-6xl text-red-400">Metaverse v1</h1>

         <Link href="/auth/signup">
            <Button variant="link">Get started</Button>
         </Link>
      </div>
   );
}
