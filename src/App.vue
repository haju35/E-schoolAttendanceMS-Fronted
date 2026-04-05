<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { getCurrentUser, isAuthenticated } = useAuth()

onMounted(async () => {
  if (isAuthenticated.value) {
    await getCurrentUser()  // Load user data if already logged in
  }
})
</script>