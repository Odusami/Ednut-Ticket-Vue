import { createApp } from 'vue'
import './styles/main.css'
import router from './components/scripts/route.js'
import App from './App.vue'

createApp(App).use(router).mount('#app')