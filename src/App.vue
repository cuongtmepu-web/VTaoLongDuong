<template>
  <div id="app">
    <!-- Lớp khói/sương mờ ảo phủ toàn trang, cố định, không chặn tương tác -->
    <div class="global-mist">
      <span class="mist-blob b1"></span>
      <span class="mist-blob b2"></span>
      <span class="mist-blob b3"></span>
    </div>
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
  position: relative;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  background: var(--bg);
  isolation: isolate;
}

/* ============================================
   KHÓI/SƯƠNG MỜ ẢO TOÀN TRANG (phong cách Đông y - Thái Cực)
   Cố định theo viewport, trôi rất chậm, độ mờ thấp để không
   ảnh hưởng khả năng đọc nội dung.
   ============================================ */
.global-mist {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}
.global-mist .mist-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.55;
  mix-blend-mode: multiply;
}
.global-mist .b1 {
  top: -10%;
  left: -8%;
  width: 42vw;
  height: 42vw;
  background: radial-gradient(circle, var(--mist-1), transparent 70%);
  animation: driftSlow1 46s ease-in-out infinite;
}
.global-mist .b2 {
  bottom: -12%;
  right: -6%;
  width: 46vw;
  height: 46vw;
  background: radial-gradient(circle, var(--mist-2), transparent 70%);
  animation: driftSlow2 54s ease-in-out infinite;
}
.global-mist .b3 {
  top: 40%;
  left: 45%;
  width: 30vw;
  height: 30vw;
  background: radial-gradient(circle, var(--mist-3), transparent 72%);
  animation: driftSlow3 60s ease-in-out infinite;
}

@keyframes driftSlow1 {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(4vw, 5vw) scale(1.12);
  }
}
@keyframes driftSlow2 {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(-5vw, -3vw) scale(1.08);
  }
}
@keyframes driftSlow3 {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) translate(3vw, -4vw) scale(1.15);
  }
}

@media (prefers-reduced-motion: reduce) {
  .global-mist .mist-blob {
    animation: none;
  }
}

#app > :not(.global-mist) {
  position: relative;
  z-index: 1;
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
