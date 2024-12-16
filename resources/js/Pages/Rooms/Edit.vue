<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import {Head, router} from '@inertiajs/vue3';
import {reactive} from "vue";

const props = defineProps(['room']);

// Reactive form object prefilled with room data
const form = reactive({
    name: props.room.name,
    description: props.room.description || '',
    is_active: props.room.is_active,
});

// Submit form
const submitForm = () => {
    router.put(route('rooms.update', props.room.id), form, {
        onSuccess: () => {
            alert('Room updated successfully!');
        },
    });
};

</script>

<template>
    <Head title="Rooms -> Edit" />

    <AuthenticatedLayout>
        <template #header>
            <h2 class="text-xl font-semibold leading-tight text-gray-800">
                Rooms -> Edit
            </h2>
        </template>

        <div class="py-12">
            <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg p-12">

                    <!-- Room Edit Form -->
                    <form @submit.prevent="submitForm" class="space-y-4">
                        <!-- Room Name -->
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Room Name</span>
                            </label>
                            <input
                                v-model="form.name"
                                type="text"
                                class="input input-bordered"
                                placeholder="Enter room name"
                                required
                            />
                        </div>

                        <!-- Room Description -->
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Room Description (Optional)</span>
                            </label>
                            <textarea
                                v-model="form.description"
                                class="textarea textarea-bordered"
                                placeholder="Enter room description"
                            ></textarea>
                        </div>

                        <!-- Room Active Status -->
                        <div class="form-control">
                            <label class="label cursor-pointer">
                                <span class="label-text">Active Status</span>
                                <input
                                    v-model="form.is_active"
                                    type="checkbox"
                                    class="toggle toggle-primary"
                                />
                            </label>
                        </div>

                        <!-- Submit Button -->
                        <div class="form-control mt-4">
                            <button type="submit" class="btn btn-primary">Update Room</button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
