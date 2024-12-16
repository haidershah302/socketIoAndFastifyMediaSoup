import { io } from 'socket.io-client';

export function useInitSocketIO() {
    const globalSocket = io('http://localhost:4000', {
        transports: ['websocket', 'polling'],
        withCredentials: true,
    });

    console.log('Global Socket.IO initialized:', globalSocket);
    return { globalSocket };
}
