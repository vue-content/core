import { reactive } from 'vue'

export const counterStore = reactive({
  count: 0
})

export function useCounterStore() {
  return { counterStore }
}
