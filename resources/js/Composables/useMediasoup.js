import { Device } from 'mediasoup-client';

export function useMediasoup() {
    let device = null;
    let sendTransport = null;
    let producer = null;

    const initializeMediasoup = async () => {
        try {
            console.log('Initializing Mediasoup Device...');
            device = new Device();

            // Fetch router RTP capabilities
            const rtpCapabilities = await fetch('/router-rtp-capabilities').then((res) =>
                res.json()
            );

            await device.load({ routerRtpCapabilities: rtpCapabilities });
            console.log('Mediasoup Device Loaded:', device);
        } catch (error) {
            console.error('Error initializing Mediasoup:', error);
        }
    };

    const startAudioStreaming = async () => {
        try {
            if (!device) {
                console.error('Device not initialized');
                return;
            }

            // Create a transport for sending audio
            const transportData = await fetch('/create-transport', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ direction: 'send' }),
            }).then((res) => res.json());

            sendTransport = device.createSendTransport(transportData);

            sendTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
                try {
                    await fetch('/connect-transport', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ dtlsParameters }),
                    });
                    callback();
                } catch (error) {
                    errback(error);
                }
            });

            sendTransport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
                try {
                    const { id } = await fetch('/produce', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ kind, rtpParameters }),
                    }).then((res) => res.json());
                    callback({ id });
                } catch (error) {
                    errback(error);
                }
            });

            console.log('Send Transport Created:', sendTransport);

            // Capture audio
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const track = stream.getAudioTracks()[0];
            producer = await sendTransport.produce({ track });

            console.log('Audio Streaming Started');
        } catch (error) {
            console.error('Error starting audio stream:', error);
        }
    };

    const stopAudioStreaming = async () => {
        if (producer) {
            await producer.close();
            console.log('Audio Streaming Stopped');
            producer = null;
        }
    };

    return { initializeMediasoup, startAudioStreaming, stopAudioStreaming };
}
