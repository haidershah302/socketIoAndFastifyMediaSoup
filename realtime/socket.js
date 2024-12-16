// socket.js
module.exports = (io, router) => {
    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        socket.on('joinRoom', ({ roomId, userId }) => {
            console.log(`User ${userId} joined room ${roomId}`);
            socket.join(roomId);

            // Notify others in the room
            socket.to(roomId).emit('userJoined', { userId });
        });

        socket.on('leaveRoom', ({ roomId, userId }) => {
            console.log(`User ${userId} left room ${roomId}`);
            socket.leave(roomId);

            // Notify others in the room
            socket.to(roomId).emit('userLeft', { userId });
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
};
