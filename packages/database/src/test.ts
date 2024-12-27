import db from './index';

async function test() {
   await db.user.findMany();
}
