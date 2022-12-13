import { createApp } from 'vue'
import './style.css'
import content from './content.json'
import App from './App.vue'
import { VueContent } from '../plugin/VueContent'

const app = createApp(App)
app.use(VueContent, { content })
app.mount('#app')
