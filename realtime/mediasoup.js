// mediasoup.js
const mediasoup = require('mediasoup');

let worker;
let router;

// Initialize Mediasoup Worker
async function initWorker() {
    worker = await mediasoup.createWorker({
        rtcMinPort: 10000,
        rtcMaxPort: 10100,
        logLevel: 'warn',
        logTags: ['info', 'ice', 'dtls', 'rtp', 'srtp', 'rtcp'],
    });

    console.log('Mediasoup Worker initialized');

    worker.on('died', () => {
        console.error('Mediasoup Worker died, exiting...');
        process.exit(1);
    });

    return worker;
}

// Create Router for Mediasoup
async function createRouter(workerInstance) {
    router = await workerInstance.createRouter({
        mediaCodecs: [
            {
                kind: 'audio',
                mimeType: 'audio/opus',
                clockRate: 48000,
                channels: 2,
            },
        ],
    });

    console.log('Mediasoup Router initialized');

    return router;
}

module.exports = {
    initWorker,
    createRouter,
};
