<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import {Head, Link, router} from '@inertiajs/vue3';

defineProps(['rooms']);

// Handle Room Deletion
const deleteRoom = (roomId) => {
    if (confirm('Are you sure you want to delete this room?')) {
        router.delete(route('rooms.destroy', roomId), {
            onSuccess: () => {
                alert('Room deleted successfully!');
            },
        });
    }
};
</script>

<template>
    <Head title="Rooms" />

    <AuthenticatedLayout>
        <template #header>
            <h2 class="text-xl font-semibold leading-tight text-gray-800">
                Rooms
            </h2>
        </template>

        <div class="py-12">
            <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">

                    <!-- Create Room Button -->
                    <div class="mb-4">
                        <Link
                            :href="route('rooms.create')"
                            class="btn btn-primary m-4"
                        >
                            Create New Room
                        </Link>
                    </div>

                    <!-- Rooms List -->
                    <div class="overflow-x-auto">
                        <table class="table table-zebra w-full">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(room, index) in rooms" :key="room.id">
                                <td>{{ index + 1 }}</td>
                                <td>{{ room.name }}</td>
                                <td>{{ room.description || 'No description' }}</td>
                                <td>
                                    <div class="flex gap-2">
                                        <Link
                                            :href="route('rooms.edit', room.id)"
                                            class="btn btn-sm btn-warning"
                                        >
                                            Edit
                                        </Link>
                                        <Link
                                            :href="route('rooms.show', room.id)"
                                            class="btn btn-sm btn-info"
                                        >
                                            Show
                                        </Link>
                                        <button
                                            @click="deleteRoom(room.id)"
                                            class="btn btn-sm btn-error"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
