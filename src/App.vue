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
  // Kiểm tra token khi app khởi động
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

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Bootstrap overrides */
.btn-primary {
  background-color: #2c3e50;
  border-color: #2c3e50;
}

.btn-primary:hover {
  background-color: #1a252f;
  border-color: #1a252f;
}

.btn-warning {
  background-color: #f39c12;
  border-color: #f39c12;
  color: white;
}

.btn-warning:hover {
  background-color: #d68910;
  border-color: #d68910;
  color: white;
}

/* Toast customization */
.Vue-Toastification__toast {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  border-radius: 8px;
}
</style>
