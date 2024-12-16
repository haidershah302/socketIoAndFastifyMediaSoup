<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import {Head, router} from '@inertiajs/vue3';
import {reactive} from "vue";

// Reactive form object
const form = reactive({
    name: '',
    description: '',
});

// Submit form
const submitForm = () => {
    router.post(route('rooms.store'), form, {
        onSuccess: () => {
            alert('Room created successfully!');
        },
    });
};
</script>

<template>
    <Head title="Rooms -> Create" />

    <AuthenticatedLayout>
        <template #header>
            <h2 class="text-xl font-semibold leading-tight text-gray-800">
                Rooms -> Create
            </h2>
        </template>

        <div class="py-12">
            <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg p-12">

                    <!-- Room Creation Form -->
                    <form @submit.prevent="submitForm" class="space-y-4 max-w-2xl">
                        <!-- Room Name -->
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text text-2xl">Room Name</span>
                            </label>
                            <input
                                v-model="form.name"
                                type="text"
                                class="input input-bordered bg-white"
                                placeholder="Enter room name"
                                required
                            />
                        </div>

                        <!-- Room Description -->
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text text-2xl">Room Description (Optional)</span>
                            </label>
                            <textarea
                                v-model="form.description"
                                class="textarea textarea-bordered bg-white"
                                placeholder="Enter room description"
                            ></textarea>
                        </div>

                        <!-- Submit Button -->
                        <div class="form-control mt-4">
                            <button type="submit" class="btn btn-primary">Create Room</button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
