import db from '@repo/database/index';

import jwt, { JwtPayload } from 'jsonwebtoken';
import { WebSocket } from 'ws';
import { RoomManager } from './room-manager';
import { OutgoingMessage } from './types';

function getRandomString(length: number) {
   const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   let result = '';
   for (let i = 0; i < length; i++) {
      result += characters.charAt(
         Math.floor(Math.random() * characters.length),
      );
   }
   return result;
}

export class User {
   public id: string;
   public userId?: string;
   public spaceId?: string;
   private x: number;
   private y: number;
   private readonly ws: WebSocket;

   constructor(ws: WebSocket) {
      this.id = getRandomString(10);
      this.x = 0;
      this.y = 0;
      this.ws = ws;
      this.initHandlers();
   }

   initHandlers() {
      this.ws.on('message', async (data) => {
         const parsedData = JSON.parse(data.toString());
         console.log('parsedData :', parsedData);

         if (parsedData.type === 'join') {
            const spaceId = parsedData.payload.spaceId;
            const token = parsedData.payload.token;
            if (!token) {
               this.send({
                  message: 'token is required',
               });
               return;
            }

            const decoded = jwt.decode(token) as JwtPayload;
            if (!decoded) {
               this.send({
                  message: 'token is not valid',
               });
               return;
            }

            const userId = decoded.userId;
            this.userId = userId;

            const space = await db.space.findFirst({ where: { id: spaceId } });
            if (!space) {
               this.send({
                  message: 'space does not exists',
               });
               return;
            }
            this.spaceId = spaceId;

            RoomManager.getInstance().addUser(spaceId, this);
            this.x = 10;
            this.y = 10;
            this.send({
               type: 'space-joined',
               payload: {
                  spawn: {
                     x: this.x,
                     y: this.y,
                  },
                  users:
                     RoomManager.getInstance()
                        .rooms.get(spaceId)
                        ?.filter((x) => x.id !== this.id)
                        ?.map((u) => ({ id: u.id })) ?? [],
               },
            });

            RoomManager.getInstance().broadcast(
               {
                  type: 'user-joined',
                  payload: {
                     userId: this.userId,
                     x: this.x,
                     y: this.y,
                  },
               },
               this,
               this.spaceId!,
            );
            return;
         }

         if (parsedData.type === 'move') {
            const moveX = parsedData.payload.x;
            const moveY = parsedData.payload.y;

            const xDisplacement = Math.abs(this.x - moveX);
            const yDisplacement = Math.abs(this.y - moveY);

            const validMove =
               (xDisplacement == 0 && yDisplacement == 1) ||
               (xDisplacement == 1 && yDisplacement == 0);
            console.log('validMove :', validMove);

            if (validMove) {
               this.x = moveX;
               this.y = moveY;
               RoomManager.getInstance().broadcast(
                  {
                     type: 'movement',
                     payload: {
                        x: this.x,
                        y: this.y,
                     },
                  },
                  this,
                  this.spaceId!,
               );
               return;
            }

            this.send({
               type: 'movement-rejected',
               payload: {
                  x: this.x,
                  y: this.y,
               },
            });
         }
      });
   }

   destroy() {
      RoomManager.getInstance().broadcast(
         {
            type: 'user-left',
            payload: {
               userId: this.userId,
            },
         },
         this,
         this.spaceId!,
      );
      RoomManager.getInstance().removeUser(this, this.spaceId!);
   }

   send(payload: OutgoingMessage) {
      this.ws.send(JSON.stringify(payload));
   }
}
