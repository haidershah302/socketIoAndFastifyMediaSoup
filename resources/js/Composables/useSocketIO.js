import { io } from 'socket.io-client';

export function useSocketIO() {
    const socket = io('http://localhost:4000', {
        transports: ['websocket', 'polling'],
        withCredentials: true, // Allows credentials for secure connections
    });

    // Join a specific room
    const joinRoom = (room) => {
        socket.emit('joinRoom', room);
        console.log(`Joined room: ${room}`);
    };

    // Send a message to a room
    const sendMessage = (room, text) => {
        socket.emit('message', { room, text });
        console.log(`Message sent to room ${room}: ${text}`);
    };

    // Listen to messages
    const onMessage = (callback) => {
        socket.on('message', (data) => {
            callback(data);
        });
    };

    // Disconnect handling
    const onDisconnect = (callback) => {
        socket.on('disconnect', () => {
            console.log('Socket.IO disconnected');
            callback();
        });
    };

    // General Socket.IO connection logs
    socket.on('connect', () => {
        console.log('Socket.IO connected!');
    });

    return { socket, joinRoom, sendMessage, onMessage, onDisconnect };
}
