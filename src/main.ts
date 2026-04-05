import { createApp } from 'vue';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import './assets/styles/main.css';

import App from './App.vue';
import router from './router';

const toastOptions = {
  position: 'top-right' as const,
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
};

const app = createApp(App);
app.use(router);
app.use(Toast, toastOptions);
app.mount('#app');