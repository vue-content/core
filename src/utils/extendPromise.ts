import { ref, Ref } from 'vue'

export interface ExtendedPromise<T> extends PromiseLike<T> {
  isLoading: Ref<boolean>
  isReady: Ref<boolean>
  block: Ref<T | undefined>
}

export function extendPromise<T>(promise: PromiseLike<T> | T) {
  const extended = (
    promise !== null && typeof promise === 'object' && 'then' in promise
      ? promise
      : new Promise(resolve => resolve(promise))
  ) as ExtendedPromise<T>
  extended.isLoading = ref(true)
  extended.isReady = ref(false)
  extended.block = ref<T | undefined>()
  extended.then(block => {
    extended.isLoading.value = false
    extended.isReady.value = true
    extended.block.value = block
  })
  return extended
}
