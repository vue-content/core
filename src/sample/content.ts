import { InMemorySource } from '../main'

export const contentSource = new InMemorySource({
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
})

export const useContent = () => {
  contentSource
}
