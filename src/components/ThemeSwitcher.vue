<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200"
      :class="[
        isDark 
          ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' 
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      ]"
    >
      <!-- Current theme icon -->
      <svg v-if="isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <span class="hidden md:inline">{{ isDark ? 'Dark' : 'Light' }}</span>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown menu -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50"
      :class="isDark ? 'bg-gray-800' : 'bg-white'"
    >
      <div class="py-1">
        <button
          @click="setTheme('light')"
          class="flex items-center w-full px-4 py-2 text-sm transition-colors"
          :class="[
            currentTheme === 'light'
              ? (isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900')
              : (isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')
          ]"
        >
          <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Light Mode
          <svg v-if="currentTheme === 'light'" class="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </button>
        
        <button
          @click="setTheme('dark')"
          class="flex items-center w-full px-4 py-2 text-sm transition-colors"
          :class="[
            currentTheme === 'dark'
              ? (isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900')
              : (isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')
          ]"
        >
          <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          Dark Mode
          <svg v-if="currentTheme === 'dark'" class="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </button>
        
        <button
          @click="setTheme('system')"
          class="flex items-center w-full px-4 py-2 text-sm transition-colors"
          :class="[
            isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          System Default
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTheme } from '@/composables/useTheme';

const { currentTheme, isDark, setTheme } = useTheme();
const isOpen = ref(false);

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.relative')) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>