// composables/useTheme.ts
import { ref, watch, onMounted } from 'vue';

type Theme = 'light' | 'dark';

export function useTheme() {
  const currentTheme = ref<Theme>('light');

  // Load theme from localStorage
  const loadTheme = () => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      currentTheme.value = savedTheme;
    } else if (prefersDark) {
      currentTheme.value = 'dark';
    } else {
      currentTheme.value = 'light';
    }
    
    applyTheme(currentTheme.value);
  };

  // Apply theme to document
  const applyTheme = (theme: Theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  };

  // Toggle theme
  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme.value);
  };

  // Set specific theme
  const setTheme = (theme: Theme) => {
    currentTheme.value = theme;
    applyTheme(theme);
  };

  // Watch for system theme changes
  const watchSystemTheme = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        currentTheme.value = e.matches ? 'dark' : 'light';
        applyTheme(currentTheme.value);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  };

  onMounted(() => {
    loadTheme();
    const cleanup = watchSystemTheme();
    return cleanup;
  });

  return {
    currentTheme,
    toggleTheme,
    setTheme,
    isDark: computed(() => currentTheme.value === 'dark'),
    isLight: computed(() => currentTheme.value === 'light')
  };
}