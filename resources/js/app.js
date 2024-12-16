// Import required CSS
import '../css/app.css';

// Import Bootstrap for Laravel and Inertia.js setup
import './bootstrap';

// Import Inertia.js components for Vue 3 integration
import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createApp, h } from 'vue';
import { ZiggyVue } from '../../vendor/tightenco/ziggy';

// Define the app's name for dynamic title generation
const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Set up the Inertia.js application
createInertiaApp({
    // Set the page title dynamically, appending the app name
    title: (title) => `${title} - ${appName}`,

    // Resolve Vue components dynamically based on the current route
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.vue`, // Pages directory
            import.meta.glob('./Pages/**/*.vue'), // Glob all Vue components
        ),

    // Set up Vue 3 with Inertia.js and Ziggy (for route helpers)
    setup({ el, App, props, plugin }) {
        return createApp({ render: () => h(App, props) }) // Create Vue app with Inertia.js
            .use(plugin) // Use Inertia.js plugin
            .use(ZiggyVue) // Use Ziggy for route generation
            .mount(el); // Mount the app to the DOM
    },

    // Configure progress bar settings for page transitions
    progress: {
        color: '#4B5563', // Set the progress bar color
    },
});
