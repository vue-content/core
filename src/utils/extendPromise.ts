import { ref, Ref } from 'vue'

export interface ExtendedPromise<T> extends Promise<T> {
  isLoading: Ref<boolean>
  isReady: Ref<boolean>
  error: Ref<Error | undefined>
  block: Ref<T | undefined>
}

export function extendPromise<T>(promise: Promise<T> | T) {
  const extended = (
    promise !== null && typeof promise === 'object' && 'then' in promise
      ? promise
      : new Promise(resolve => resolve(promise))
  ) as ExtendedPromise<T>
  extended.isLoading = ref(true)
  extended.isReady = ref(false)
  extended.block = ref<T | undefined>()
  extended.error = ref<Error | undefined>()
  extended
    .then(block => {
      extended.isLoading.value = false
      extended.isReady.value = true
      extended.block.value = block
    })
    .catch((err: Error) => {
      extended.error.value = err
    })
  return extended
}
