import { ref, reactive } from 'vue'

export function useForm<T extends Record<string, any>>(initialData: T) {
  const form = reactive<T>({ ...initialData })
  const errors = ref<Partial<Record<keyof T, string[]>>>({})
  const loading = ref(false)
  
  const reset = () => {
    Object.assign(form, initialData)
    errors.value = {}
  }
  
  const setErrors = (newErrors: Partial<Record<keyof T, string[]>>) => {
    errors.value = newErrors
  }
  
  const clearErrors = () => {
    errors.value = {}
  }
  
  return {
    form,
    errors,
    loading,
    reset,
    setErrors,
    clearErrors
  }
}