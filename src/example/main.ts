import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { VueContent } from '../plugin/VueContent'

const app = createApp(App)
app.use(VueContent, { path: '../example/content.json' })
app.mount('#app')
