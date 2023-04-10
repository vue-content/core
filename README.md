# @vue-content/core

This is the core package for vue-content. Use this to start integrating the cms into your project.

_PLEASE NOTE_ that vue-content is still in early development, please report any issues you encounter, and test it thoroughly before using it in any real life application!

## Example

First set up your [content source](https://vue-content.com/introduction#content-sources). Depending on where your content lives, the setup process will look a bit different. Please refer to the documentation of your specific content source.

```js
// content.js
import { defineContent } from '@vue-content/core/in-memory-source'

export const { useContentBlock, contentSource } = defineContent({
  msg: 'You did it!',
  innerBlock: {
    subtitle: "You're awesome 🎉"
  }
})
```

Then provide the content source when you install the plugin

```js
// main.js
import { createVueContent } from '@vue-content/core'
import { contentSource } from './content'

const app = createApp(App)
app.use(
  createVueContent({
    source: contentSource // <-- here is your content source
  })
)
```

Please refer to the [documentation](https://vue-content.com) for more information on [available content sources](https://vue-content.com/introduction#content-sources), how to [fetch data](https://vue-content.com/data-fetching), [formatting and sanitization](https://vue-content.com/data-fetching#formatting-and-sanitization), [variable substitution](https://vue-content.com/data-fetching#variables) and other features.

## Contribute

Please try out the library in your projects and [report bugs](https://github.com/vue-content/core/issues). If you have ideas on how to improve the library, please [let us know](https://github.com/vue-content/core/issues).

There's always a need to support more different content sources. If you're missing a specific cms, file an issue about it (if no one else has done it already).
