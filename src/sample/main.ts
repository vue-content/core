import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { VueContent } from '../plugin/VueContent'
import { InMemorySource } from '../main'
import { contentSource } from './content'

const app = createApp(App)
app.use(VueContent, {
  locale: 'en',
  // Please note that this is the simplest source possible, it can be replaced with any other content source
  source: contentSource
})

app.mount('#app')
