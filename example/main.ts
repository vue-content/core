import { createApp, reactive } from 'vue'
import './style.css'
import App from './App.vue'
import { createVueContent } from '../src/plugin/VueContent'
import { contentSource } from './content'
import { counterStore } from './store'

const app = createApp(App)
app.use(
  createVueContent({
    locale: 'en',
    // Please note that this is the simplest source possible, it can be replaced with any other content source
    source: contentSource,
    stores: {
      counterStore
    }
  })
)

app.mount('#app')
