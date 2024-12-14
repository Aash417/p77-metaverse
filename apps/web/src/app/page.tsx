import db from '@repo/database';

export default async function Page() {
   const user = await db.user.findMany();

   return (
      <main className="flex flex-col items-center justify-between min-h-screen p-24">
         hello world
         <div>{JSON.stringify(user)}</div>
      </main>
   );
}
