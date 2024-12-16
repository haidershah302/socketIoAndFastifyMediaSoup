const fastify = require('fastify')({ logger: true });
const socketIO = require('socket.io');
const mediasoup = require('mediasoup');
const cors = require('@fastify/cors');

// Register CORS
fastify.register(cors, { origin: '*' });

// Create HTTP Server for Socket.IO
const server = require('http').createServer(fastify.server);
const io = socketIO(server, { cors: { origin: '*' } });

// Mediasoup Setup
const rooms = {}; // Store room-related data
const workers = [];
let router; // Global Router Instance

// Function to Create Mediasoup Worker
async function createWorker() {
    const worker = await mediasoup.createWorker();
    workers.push(worker);
    return worker;
}

// Function to Initialize Mediasoup Router
async function initializeMediasoup() {
    const worker = await createWorker();
    router = await worker.createRouter({
        mediaCodecs: [{ kind: 'audio', mimeType: 'audio/opus', clockRate: 48000, channels: 2 }],
    });
    console.log('Mediasoup Router initialized:', router);
}

// Fastify Route for Router RTP Capabilities
fastify.get('/router-rtp-capabilities', async (req, reply) => {
    try {
        console.log('Route Hit: /router-rtp-capabilities');
        console.log('Router State:', router);

        if (!router) {
            console.error('Router not initialized');
            return reply.code(500).send({ error: 'Router not initialized' });
        }

        const rtpCapabilities = router.rtpCapabilities;
        console.log('Sending RTP Capabilities:', rtpCapabilities);

        reply.header('Content-Type', 'application/json');
        reply.code(200).send(rtpCapabilities);
    } catch (error) {
        console.error('Error in Route Handler:', error);
        reply.code(500).send({ error: 'Internal Server Error', details: error.message });
    }
});

// Socket.IO Logic
io.on('connection', (socket) => {
    console.log('New Client Connected');

    socket.on('joinRoom', ({ roomId, user }) => {
        if (!rooms[roomId]) {
            rooms[roomId] = { seats: Array(15).fill({ user: null }), transports: {} };
        }
        socket.join(roomId);
        io.to(roomId).emit('userJoined', { text: `${user.name} has entered the room.`, user: 'System' });
    });

    socket.on('message', ({ text, user, roomId }) => {
        io.to(roomId).emit('message', { text, user });
    });

    socket.on('takeSeat', ({ seatIndex, user, roomId }) => {
        const room = rooms[roomId];
        if (room) {
            room.seats = room.seats.map((seat, index) =>
                index === seatIndex ? { user } : seat.user?.id === user.id ? { user: null } : seat
            );
            io.to(roomId).emit('seatUpdate', room.seats);
        }
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected');
    });
});

// Main Initialization Block
(async () => {
    try {
        await initializeMediasoup();
        console.log('Mediasoup Router successfully initialized.');

        // Log All Registered Routes
        console.log('Registered Routes:', fastify.printRoutes());

        // Start Server
        server.listen(3000, () => {
            console.log('Server running on http://localhost:3000');
        });
    } catch (err) {
        console.error('Error during Initialization:', err);
    }
})();

// just setting up new envoirnment to make it work
