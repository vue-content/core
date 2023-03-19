import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createVueContent } from '../plugin/VueContent'
import { contentSource } from './content'

const app = createApp(App)
app.use(
  createVueContent({
    locale: 'en',
    // Please note that this is the simplest source possible, it can be replaced with any other content source
    source: contentSource
  })
)

app.mount('#app')
