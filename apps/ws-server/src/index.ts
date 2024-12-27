import { WebSocketServer } from 'ws';
import { User } from './user';

const wss = new WebSocketServer({ port: 9001 });
console.log('server started on 9001');

wss.on('connection', function connection(ws) {
   console.log('user connected');

   let user = new User(ws);
   ws.on('error', console.error);

   ws.on('close', () => {
      if (user) {
         user.destroy();
      }
   });
});
