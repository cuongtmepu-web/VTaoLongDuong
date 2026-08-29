<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/api/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  const token = localStorage.getItem('token')
  if (token) {
    authStore.token = token
    authStore.user = JSON.parse(localStorage.getItem('user') || 'null')
    authStore.isAuthenticated = true
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--bg);
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
}

#app {
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  background: var(--bg);
}

.btn-primary,
.btn-secondary,
.btn-outline,
.text-primary,
.bg-primary,
.text-secondary,
.bg-secondary {
  transition: all 0.3s var(--ease);
}

.text-primary {
  color: var(--primary) !important;
}
.bg-primary {
  background: var(--primary) !important;
}
.text-secondary {
  color: var(--secondary) !important;
}
.bg-secondary {
  background: var(--secondary) !important;
}
</style>
