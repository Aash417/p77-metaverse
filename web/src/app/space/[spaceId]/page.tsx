'use client';

import { Button } from '@/components/ui/button';
import {
   ControlBar,
   GridLayout,
   LiveKitRoom,
   ParticipantTile,
   RoomAudioRenderer,
   useTracks,
} from '@livekit/components-react';
import '@livekit/components-styles';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Track } from 'livekit-client';
import { useRouter } from 'next/navigation';
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

export default function Page(params: Readonly<Props>) {
   const router = useRouter();
   const spaceId = params.params.spaceId;
   const [token, setToken] = useState<string>('');
   const [username, setUsername] = useState<string>('');
   const [userId, setUserId] = useState<string>('');

   const room = spaceId;
   const name = userId;
   const [liveKitToken, setLiveKitToken] = useState('');

   useEffect(() => {
      if (typeof window !== 'undefined') {
         const token = window.localStorage.getItem('metaverse_user');
         setToken(token ?? '');

         if (token) {
            const userId = (jwt.decode(token) as JwtPayload).userId;
            setUserId(userId ?? '');
         }
      }
   }, []);

   const canvasRef = useRef<HTMLCanvasElement | null>(null);
   const wsRef = useRef<WebSocket | null>(null);

   const [currentUser, setCurrentUser] = useState<User | null>(null);
   const [users, setUsers] = useState(new Map());

   function leaveRoom() {
      if (!wsRef.current) return;

      wsRef.current.send(
         JSON.stringify({
            type: 'user-left',
            payload: {
               userId,
            },
         }),
      );

      router.replace('/arena');
   }

   async function getLiveKitToken() {
      try {
         const resp = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/token?room=${room}&username=${name}`,
         );
         const data = await resp.json();
         setLiveKitToken(data.token);
      } catch (e) {
         console.error(e);
      }
   }
   function resetLiveKitToken() {
      setLiveKitToken('');
   }

   const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
      console.log('message :', message);
      switch (message.type) {
         case 'space-joined': {
            // Initialize current user position and other users
            console.log({
               type: message.type,
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
      console.log('one');
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
         console.log(message);
         handleWebSocketMessage(message);
      };

      return () => {
         if (wsRef.current) {
            wsRef.current.close();
         }
      };
   }, [handleWebSocketMessage, spaceId, token]);

   // Draw the arena
   useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = '#eee';
      for (let i = 0; i < canvas.width; i += 40) {
         ctx.beginPath();
         ctx.moveTo(i, 0);
         ctx.lineTo(i, canvas.height);
         ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 40) {
         ctx.beginPath();
         ctx.moveTo(0, i);
         ctx.lineTo(canvas.width, i);
         ctx.stroke();
      }

      // Draw current user
      if (currentUser?.x) {
         ctx.beginPath();
         ctx.fillStyle = '#FF6B6B';
         ctx.arc(currentUser.x * 40, currentUser.y * 40, 15, 0, Math.PI * 2);
         ctx.fill();
         ctx.fillStyle = '#000';
         ctx.font = '14px Arial';
         ctx.textAlign = 'center';
         ctx.fillText('You', currentUser.x * 40, currentUser.y * 40 + 40);
      }

      // Draw other users
      users.forEach((user) => {
         if (!user.x) {
            return;
         }
         ctx.beginPath();
         ctx.fillStyle = '#4ECDC4';
         ctx.arc(user.x * 40, user.y * 40, 15, 0, Math.PI * 2);
         ctx.fill();
         ctx.fillStyle = '#000';
         ctx.font = '14px Arial';
         ctx.textAlign = 'center';
         ctx.fillText(`User ${user.userId}`, user.x * 40, user.y * 40 + 40);
      });
   }, [currentUser, users]);

   return (
      <div className="flex">
         <div className="w-1/4">
            {liveKitToken && (
               <LiveKitRoom
                  video={true}
                  audio={true}
                  token={liveKitToken}
                  serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
                  // Use the default LiveKit theme for nice styles.
                  data-lk-theme="default"
                  className="h-[300px] max-h-screen"
                  style={{ height: '50vh' }}
               >
                  {/* Your custom component with basic video conferencing functionality. */}
                  <MyVideoConference />
                  {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
                  <RoomAudioRenderer />
                  {/* Controls for the user to start/stop audio, video, and screen
      share tracks and to leave the room. */}
                  <ControlBar variation="minimal" />
               </LiveKitRoom>
            )}
         </div>

         <section
            className="p-4"
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="region"
         >
            <h1 className="mb-4 text-2xl font-bold">Playground</h1>
            <div className="mb-4">
               <p className="text-sm text-gray-600">
                  Connected Users: {users.size + (currentUser ? 1 : 0)}
               </p>
               <div className="flex gap-2">
                  <Button onClick={leaveRoom} variant="outline">
                     leave space
                  </Button>
                  <Button onClick={getLiveKitToken} variant="outline">
                     enable video chat
                  </Button>
                  <Button onClick={resetLiveKitToken} variant="destructive">
                     disable video chat
                  </Button>
               </div>
            </div>
            <div className="overflow-hidden rounded-lg border">
               <canvas
                  ref={canvasRef}
                  width={950}
                  height={950}
                  className="bg-white"
               />
            </div>
            <p className="mt-2 text-sm text-gray-500">
               Use arrow keys to move your avatar
            </p>
         </section>
      </div>
   );
}

function MyVideoConference() {
   // `useTracks` returns all camera and screen share tracks. If a user
   // joins without a published camera track, a placeholder track is returned.
   const tracks = useTracks(
      [
         { source: Track.Source.Camera, withPlaceholder: true },
         { source: Track.Source.ScreenShare, withPlaceholder: false },
      ],
      { onlySubscribed: false },
   );

   return (
      <GridLayout tracks={tracks}>
         <ParticipantTile />
      </GridLayout>
   );
}
