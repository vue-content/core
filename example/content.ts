import { defineContent } from '../src/plugin/LocalizedInMemorySource'

const content = {
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
    },
    features: {
      title: 'Features',
      cards: [
        {
          title: 'Intuitive',
          details:
            '<b>Bind content from {{cms}}</b> with provided directives, components and composables.'
        },
        {
          title: 'Lightweight',
          details: 'The core package is <b>&lt;10K minified</b> and gzipped.'
        },
        {
          title: 'Live editor',
          details:
            '<b>Edit your content</b> right in place without affecting your bundle size.'
        }
      ]
    },
    disclaimer: '* this little disclaimer comes from the root block'
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
    },
    disclaimer: '* den här lilla varningen kommer från huvudblocket'
  }
}

export const { useContentBlock, contentSource } = defineContent('en', content)
