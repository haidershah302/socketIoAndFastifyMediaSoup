<template>
    <div class="room-container bg-black text-white h-screen">
        <!-- Room Header -->
        <div class="flex justify-between items-center px-4 py-2 border-b border-gray-700">
            <div class="flex items-center">
                <img :src="room.avatar" alt="Room Avatar" class="w-12 h-12 rounded-full" />
                <div class="ml-3">
                    <h2 class="text-xl font-bold">{{ room.name }}</h2>
                    <p>ID: {{ room.id }}</p>
                </div>
            </div>
            <div>
                <button class="bg-red-500 px-4 py-2 rounded" @click="exitRoom">Exit</button>
            </div>
        </div>

        <!-- Seats Grid -->
        <div class="grid grid-cols-5 gap-4 p-4">
            <div v-for="(seat, index) in seats" :key="index" class="seat">
                <div
                    class="h-20 w-20 flex items-center justify-center border border-yellow-400 rounded-full bg-gray-800 cursor-pointer"
                    :class="{ 'border-red-500': seat.user && seat.user.id === user.id, 'border-yellow-400': seat.user }"
                    @click="seat.user && seat.user.id === user.id ? leaveSeat() : takeSeat(index)"
                >
                    <img v-if="seat.user" :src="seat.user.avatar || placeholderAvatar" class="w-12 h-12 rounded-full" />
                    <span v-else class="text-gray-400">Seat {{ index + 1 }}</span>
                </div>
            </div>
        </div>

        <!-- Messages -->
        <div class="messages-container flex-1 px-4 py-2 overflow-y-scroll">
            <div v-for="(message, index) in messages" :key="index" class="mb-2">
                <p>
                    <strong>{{ message.user }}:</strong> {{ message.text }}
                </p>
            </div>
        </div>

        <!-- Message Input -->
        <div class="flex p-4 bg-gray-900">
            <input
                v-model="newMessage"
                placeholder="Hi Friends"
                class="flex-1 rounded-l-lg p-2"
                @keyup.enter="sendMessage"
            />
            <button
                @click="sendMessage"
                class="bg-pink-600 px-4 rounded-r-lg flex items-center justify-center"
            >
                ✉
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { usePage } from '@inertiajs/vue3';
import { io } from 'socket.io-client';
import * as mediasoupClient from 'mediasoup-client';

const { room } = usePage().props;
const socket = io('http://localhost:3000');
const messages = ref([]);
const newMessage = ref('');
const seats = ref(Array(15).fill({ user: null }));
const user = usePage().props.auth.user;
const placeholderAvatar = 'https://avatar.iran.liara.run/public';

let device, producerTransport, producer;

onMounted(() => {
    socket.emit('joinRoom', { roomId: room.id, user });

    socket.on('message', (message) => {
        messages.value.push(message);
    });

    socket.on('seatUpdate', (updatedSeats) => {
        seats.value = updatedSeats;
    });

    socket.on('userJoined', (msg) => {
        messages.value.push(msg);
    });
});

onUnmounted(() => {
    socket.disconnect();
});

function sendMessage() {
    if (newMessage.value.trim()) {
        socket.emit('message', {
            text: newMessage.value,
            user: user.name,
            roomId: room.id,
        });
        newMessage.value = '';
    }
}

async function takeSeat(index) {
    socket.emit('takeSeat', { seatIndex: index, user, roomId: room.id });
    await initializeMediasoup();
}

function leaveSeat() {
    socket.emit('leaveSeat', { userId: user.id, roomId: room.id });
    if (producer) {
        producer.close();
        producer = null;
    }
}

async function initializeMediasoup() {
    if (!device) device = new mediasoupClient.Device();

    const routerRtpCapabilities = await fetch('/router-rtp-capabilities').then((res) => res.json());
    await device.load({ routerRtpCapabilities });

    const { transportOptions } = await fetch('/create-transport').then((res) => res.json());
    producerTransport = device.createSendTransport(transportOptions);

    producerTransport.on('connect', ({ dtlsParameters }, callback) => {
        socket.emit('connectTransport', { dtlsParameters }, callback);
    });

    producerTransport.on('produce', ({ kind, rtpParameters }, callback) => {
        socket.emit('produce', { kind, rtpParameters }, callback);
    });

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    producer = await producerTransport.produce({ track: stream.getAudioTracks()[0] });
}

function exitRoom() {
    socket.disconnect();
    window.location.href = '/rooms';
}
</script>

<style scoped>
.room-container {
    display: flex;
    flex-direction: column;
}
.seat {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
