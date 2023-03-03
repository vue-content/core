import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { VueContent } from '../plugin/VueContent'

const app = createApp(App)
app.use(VueContent, {
  locale: 'en',
  // Please note that this is the simplest source possible, it can be replaced with any other content source
  source: {
    en: {
      title: 'Vue content',
      card: {
        editSample:
          'Experiment with files inside the <code>src/sample</code> folder to see the how a simple setup could look.',
        countResult: 'count is {{ count }}'
      },
      moreInfo: `
                <p>Check out <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, the official Vue + Vite starter</p>
                <p>Install <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a> in your IDE for a better DX</p>
                <p>Click on the Vite and Vue logos to learn more</p>
            `,
      currentLocale: 'Current locale: {{ locale }}',
      wizard: {
        title: 'Wizard step {{ currentStep }}',
        step1: `<p>Look how Vue content works with dynamic elements that toggles like the buttons.</p>`,
        step2: `<p>It also works fine with fields that changes id like this description.</p>`,
        step3: `<p>That's it. Play around and have fun.</p>`,
        buttons: {
          next: 'Next',
          previous: 'Previous'
        }
      }
    },
    se: {
      title: 'Vue content',
      card: {
        editSample:
          'Experimentera med filerna i mappen <code>components/HelloWorld.vue</code> för att se hur en grunduppsättning kan se ut.',
        countResult: 'count är {{ count }}'
      },
      moreInfo: `
                <p>Spana in <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, den officiella Vue + Vite startern</p>
                <p>Installera <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a> i din IDE för bättre DX</p>
                <p>Klicka på Vite- och Vue-loggorna för att lära dig mer</p>
            `,
      currentLocale: 'Vald översättning: {{ locale }}',
      wizard: {
        title: 'Guide steg {{ currentStep }}',
        step1: `<p>Se hur Vue content fungerar med dynamiska element som knapparna.</p>`,
        step2: `<p>Det fungerar också fint med fält som ändrar id som den här beskrivningen.</p>`,
        step3: `<p>Det var allt. Testa runt och ha kul.</p>`,
        buttons: {
          next: 'Nästa',
          previous: 'Bakåt'
        }
      }
    }
  }
})

app.mount('#app')
