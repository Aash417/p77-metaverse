'use client';
import { useToken } from '@/lib/tokenContext';

import { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
   params: { spaceId: string };
};

interface User {
   x: number;
   y: number;
   userId: string;
}

interface WebSocketMessage {
   type: string;
   payload: {
      spawn?: { x: number; y: number };
      userId?: string;
      users?: User[];
      x?: number;
      y?: number;
   };
}

export default function Page(params: Props) {
   const spaceId = params.params.spaceId;
   const { token } = useToken();

   const canvasRef = useRef<HTMLCanvasElement | null>(null);
   const wsRef = useRef<WebSocket | null>(null);

   const [currentUser, setCurrentUser] = useState<User | null>(null);
   const [users, setUsers] = useState(new Map());

   const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
      switch (message.type) {
         case 'space-joined': {
            // Initialize current user position and other users
            console.log({
               x: message.payload.spawn?.x ?? 0,
               y: message.payload.spawn?.y ?? 0,
               userId: message.payload.userId ?? '',
            });
            setCurrentUser({
               x: message.payload.spawn?.x ?? 0,
               y: message.payload.spawn?.y ?? 0,
               userId: message.payload.userId ?? '',
            });

            // Initialize other users from the payload
            const userMap = new Map();
            message.payload.users?.forEach((user: User) => {
               userMap.set(user.userId, user);
            });
            setUsers(userMap);
            break;
         }

         case 'user-joined':
            setUsers((prev) => {
               const newUsers = new Map(prev);
               newUsers.set(message.payload.userId, {
                  x: message.payload.x,
                  y: message.payload.y,
                  userId: message.payload.userId,
               });
               return newUsers;
            });
            break;

         case 'movement':
            setUsers((prev) => {
               const newUsers = new Map(prev);
               const user = newUsers.get(message.payload.userId);
               if (user) {
                  user.x = message.payload.x;
                  user.y = message.payload.y;
                  newUsers.set(message.payload.userId, user);
               }
               return newUsers;
            });
            break;

         case 'movement-rejected':
            // Reset current user position if movement was rejected
            setCurrentUser((prev: User | null) => ({
               ...prev!,
               x: message.payload.x ?? prev!.x,
               y: message.payload.y ?? prev!.y,
            }));
            break;

         case 'user-left':
            setUsers((prev) => {
               const newUsers = new Map(prev);
               newUsers.delete(message.payload.userId);
               return newUsers;
            });
            break;
      }
   }, []);

   // Handle user movement
   const handleMove = (newX: number, newY: number) => {
      if (!currentUser || !wsRef.current) return;

      // Send movement request
      wsRef.current.send(
         JSON.stringify({
            type: 'move',
            payload: {
               x: newX,
               y: newY,
               userId: currentUser.userId,
            },
         }),
      );
   };

   const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!currentUser) return;

      const { x, y } = currentUser;
      switch (e.key) {
         case 'ArrowUp':
            handleMove(x, y - 1);
            break;
         case 'ArrowDown':
            handleMove(x, y + 1);
            break;
         case 'ArrowLeft':
            handleMove(x - 1, y);
            break;
         case 'ArrowRight':
            handleMove(x + 1, y);
            break;
      }
   };

   // Initialize WebSocket connection and handle URL params
   useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);

      // Initialize WebSocket
      wsRef.current = new WebSocket('ws://localhost:9001'); // Replace with your WS_URL

      wsRef.current.onopen = () => {
         if (!wsRef.current) return;

         // Join the space once connected
         wsRef.current.send(
            JSON.stringify({
               type: 'join',
               payload: {
                  spaceId,
                  token,
               },
            }),
         );
      };

      wsRef.current.onmessage = (event: MessageEvent) => {
         const message = JSON.parse(event.data);
         handleWebSocketMessage(message);
      };

      return () => {
         if (wsRef.current) {
            wsRef.current.close();
         }
      };
   }, [handleWebSocketMessage]);

   // Draw the arena
   useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = '#eee';
      for (let i = 0; i < canvas.width; i += 50) {
         ctx.beginPath();
         ctx.moveTo(i, 0);
         ctx.lineTo(i, canvas.height);
         ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 50) {
         ctx.beginPath();
         ctx.moveTo(0, i);
         ctx.lineTo(canvas.width, i);
         ctx.stroke();
      }

      // Draw current user
      if (currentUser && currentUser.x) {
         ctx.beginPath();
         ctx.fillStyle = '#FF6B6B';
         ctx.arc(currentUser.x * 50, currentUser.y * 50, 20, 0, Math.PI * 2);
         ctx.fill();
         ctx.fillStyle = '#000';
         ctx.font = '14px Arial';
         ctx.textAlign = 'center';
         ctx.fillText('You', currentUser.x * 50, currentUser.y * 50 + 40);
      }

      // Draw other users
      users.forEach((user) => {
         if (!user.x) {
            return;
         }
         ctx.beginPath();
         ctx.fillStyle = '#4ECDC4';
         ctx.arc(user.x * 50, user.y * 50, 20, 0, Math.PI * 2);
         ctx.fill();
         ctx.fillStyle = '#000';
         ctx.font = '14px Arial';
         ctx.textAlign = 'center';
         ctx.fillText(`User ${user.userId}`, user.x * 50, user.y * 50 + 40);
      });
   }, [currentUser, users]);

   return (
      <section
         className="p-4"
         onKeyDown={handleKeyDown}
         tabIndex={0}
         role="region"
      >
         <h1 className="mb-4 text-2xl font-bold">Arena</h1>
         <div className="mb-4">
            <p className="text-sm text-gray-600">Token: {token}</p>
            <p className="text-sm text-gray-600">Space ID: {spaceId}</p>
            <p className="text-sm text-gray-600">
               Connected Users: {users.size + (currentUser ? 1 : 0)}
            </p>
         </div>
         <div className="overflow-hidden rounded-lg border">
            <canvas
               ref={canvasRef}
               width={1500}
               height={1000}
               className="bg-white"
            />
         </div>
         <p className="mt-2 text-sm text-gray-500">
            Use arrow keys to move your avatar
         </p>
      </section>
   );
}
