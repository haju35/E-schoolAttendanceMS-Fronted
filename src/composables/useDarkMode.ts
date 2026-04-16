import { ref } from 'vue'

const isDark = ref(false)

// init once
if (localStorage.getItem('theme') === 'dark') {
  isDark.value = true
  document.documentElement.classList.add('dark')
}

export function useDarkMode() {

  const toggleDark = () => {
    isDark.value = !isDark.value

    if (isDark.value) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return { isDark, toggleDark }
}