<template>
  <div
    class="min-h-screen transition-colors duration-300"
    :class="isDark ? 'bg-gray-900' : 'bg-gray-100'"
  >
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useDarkMode } from '@/composables/useDarkMode'

const { getCurrentUser, isAuthenticated } = useAuth()
const { isDark } = useDarkMode() // Just to ensure it's initialized

onMounted(async () => {
  if (isAuthenticated.value) {
    await getCurrentUser()
  }
})
</script>