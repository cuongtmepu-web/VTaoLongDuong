<template>
  <section class="hero-section">
    <div class="hero-overlay"></div>
    <div class="container hero-content">
      <div class="row align-items-center min-vh-75">
        <div class="col-lg-8 mx-auto text-center text-white">
          <span class="eyebrow">Chăm sóc sức khỏe theo tinh hoa Đông y</span>
          <h1>
            {{ sectionData.title || 'Tảo Long Đường - Đông y gia truyền' }}
          </h1>
          <p class="lead">
            {{ sectionData.subtitle || 'Hơn 10 năm kinh nghiệm chăm sóc sức khỏe cộng đồng' }}
          </p>
          <div class="hero-actions">
            <router-link
              v-if="authStore.isAuthenticated"
              to="/user/appointments/book"
              class="btn btn-warning btn-lg me-3"
            >
              {{ sectionData.buttonText || 'Đặt lịch ngay' }}
            </router-link>
            <router-link v-else to="/login" class="btn btn-warning btn-lg me-3">
              {{ sectionData.buttonText || 'Đặt lịch ngay' }}
            </router-link>
            <router-link to="/bai-thuoc" class="btn btn-outline-light btn-lg">
              Xem bài thuốc
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLandingStore } from '@/api/stores/landing'
import { useAuthStore } from '@/api/stores/auth'

const landingStore = useLandingStore()
const authStore = useAuthStore()

const sectionData = computed(() => landingStore.getSection('hero'))
</script>

<style scoped>
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 6rem 0 4rem;
  background: linear-gradient(160deg, #e8f8f5 0%, #f0f7fa 100%);
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: -30%;
  right: -10%;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--primary-glow), transparent 70%);
  filter: blur(40px);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero-left {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.eyebrow {
  display: inline-block;
  padding: 0.3rem 1rem;
  border-radius: 999px;
  background: var(--primary-light);
  color: var(--primary-dark);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  width: fit-content;
}

.hero-left h1 {
  font-size: clamp(2.8rem, 5.5vw, 4.8rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.04em;
  color: var(--text);
}
.hero-left h1 .highlight {
  color: var(--primary);
  position: relative;
}
.hero-left h1 .highlight::after {
  content: '';
  position: absolute;
  bottom: 0.1em;
  left: 0;
  right: 0;
  height: 0.15em;
  background: var(--secondary);
  opacity: 0.3;
  border-radius: 999px;
}

.hero-description {
  font-size: 1.2rem;
  color: var(--text-soft);
  max-width: 520px;
  line-height: 1.8;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.social-proof {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
  color: var(--text-muted);
  font-size: 0.9rem;
}
.social-proof .avatars {
  display: flex;
}
.social-proof .avatars img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--surface);
  margin-right: -8px;
  box-shadow: var(--shadow-sm);
}

.hero-right {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-image {
  width: 100%;
  max-width: 580px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--surface-border);
  transition: transform 0.5s var(--ease);
}
.hero-image:hover {
  transform: scale(1.02) rotate(1deg);
}

/* Animation fade-up (dùng Intersection Observer hoặc CSS) */
.hero-left > * {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeUp 0.8s var(--ease) forwards;
}
.hero-left .eyebrow {
  animation-delay: 0.1s;
}
.hero-left h1 {
  animation-delay: 0.2s;
}
.hero-left .hero-description {
  animation-delay: 0.3s;
}
.hero-left .hero-actions {
  animation-delay: 0.4s;
}
.hero-left .social-proof {
  animation-delay: 0.5s;
}
.hero-right {
  opacity: 0;
  transform: translateX(30px);
  animation: fadeSlide 0.9s var(--ease) 0.2s forwards;
}

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes fadeSlide {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive */
@media (max-width: 992px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }
  .hero-left {
    align-items: center;
  }
  .hero-description {
    max-width: 100%;
  }
  .hero-actions {
    justify-content: center;
  }
  .hero-right {
    order: -1;
  }
  .hero-image {
    max-width: 480px;
  }
}
@media (max-width: 576px) {
  .hero-section {
    min-height: 90vh;
    padding: 5rem 0 3rem;
  }
  .hero-left h1 {
    font-size: 2.4rem;
  }
  .hero-description {
    font-size: 1rem;
  }
  .hero-actions .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
