import { createApp } from 'vue';
import App from './App.vue';
import router from './appRouter';
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';
import ToastService from 'primevue/toastservice';
import BlankLayout from "@/features/layouts/Blank.vue";
import DefaultLayout from "@/features/layouts/Default.vue";
import { LayoutName } from "@/features/layouts/layoutName";
import { Binom } from './assets/styles/preset';
import { extendStringPrototype } from './common/utilities/global';

extendStringPrototype();

const app = createApp(App)

app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Binom,
        options: {
            darkModeSelector: '.app-dark-theme',
            cssLayer: true
        }
    },
    inputVariant: "filled"
});
app.use(ToastService);

app.directive('tooltip', Tooltip);

app
    .component(LayoutName.Default, DefaultLayout)
    .component(LayoutName.Blank, BlankLayout)

app.mount('#app')