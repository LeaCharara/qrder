import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import {messaging} from './firebase'
import './registerServiceWorker'

const app = createApp(App)
app.config.globalProperties.$messaging = messaging
app.use(router).use(vuetify).mount("#app");

