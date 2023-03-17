import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true
    })
  ],
  build: {
    lib: {
      entry: [
        resolve(__dirname, 'src/main.ts'),
        resolve(__dirname, 'src/plugin/InMemorySource.ts'),
        resolve(__dirname, 'src/plugin/LocalizedInMemorySource.ts')
      ],
      name: 'VueContent'
    },
    rollupOptions: {
      output: {
        globals: {
          vue: 'Vue'
        }
      },
      external: ['vue']
    }
  },
  test: {
    include: ['test/unit/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    includeSource: ['src/**/*.{js,ts}']
  }
})
