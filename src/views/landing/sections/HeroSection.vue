<template>
  <section class="hero-section">
    <div class="mist-layer"></div>

    <!-- Vòng Thái Cực xoay chậm phía sau, mờ, mang tính biểu tượng -->
    <svg class="taiji-watermark" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" stroke-width="1" />
      <path
        d="M50,3 A23.5,23.5 0 0,1 50,50 A23.5,23.5 0 0,0 50,97 A47,47 0 0,1 50,3 Z"
        fill="currentColor"
      />
      <circle cx="50" cy="26.5" r="7" fill="transparent" stroke="currentColor" stroke-width="1" />
      <circle cx="50" cy="73.5" r="7" fill="currentColor" />
    </svg>

    <div class="container hero-content">
      <div class="hero-inner">
        <span class="eyebrow">
          <span class="eyebrow-dot"></span>
          Tinh hoa Đông y — dưỡng thân, an tâm
        </span>

        <h1>
          {{ sectionData.title || 'Tảo Long Đường' }}
          <span class="hero-sub-title">{{ sectionData.titleDetail || 'Đông y gia truyền' }}</span>
        </h1>

        <p class="hero-description">
          {{
            sectionData.subtitle ||
            'Hơn 200 năm gìn giữ bài thuốc gia truyền, kết hợp tinh hoa Đông y cổ truyền với phương pháp thăm khám hiện đại — khoa học, an toàn và tận tâm.'
          }}
        </p>

        <div class="hero-actions">
          <router-link
            v-if="authStore.isAuthenticated"
            to="/user/appointments/book"
            class="btn btn-gold btn-lg"
          >
            {{ sectionData.buttonText || 'Đặt lịch ngay' }}
          </router-link>
          <router-link v-else to="/login" class="btn btn-gold btn-lg">
            {{ sectionData.buttonText || 'Đặt lịch ngay' }}
          </router-link>
          <router-link to="/bai-thuoc" class="btn btn-outline-light btn-lg">
            Xem bài thuốc
          </router-link>
        </div>

        <!-- Triết lý Thái Cực: 1 -> 2 -> 4 -> 8, gợi chiều sâu triết lý Đông y -->
        <div class="taiji-philosophy" aria-label="Triết lý Thái Cực">
          <div class="ph-step">
            <span class="ph-num">一</span>
            <span class="ph-label">Thái Cực</span>
          </div>
          <span class="ph-arrow">→</span>
          <div class="ph-step">
            <span class="ph-num">二</span>
            <span class="ph-label">Lưỡng Nghi</span>
          </div>
          <span class="ph-arrow">→</span>
          <div class="ph-step">
            <span class="ph-num">四</span>
            <span class="ph-label">Tứ Tượng</span>
          </div>
          <span class="ph-arrow">→</span>
          <div class="ph-step">
            <span class="ph-num">八</span>
            <span class="ph-label">Bát Quái</span>
          </div>
        </div>
      </div>
    </div>

    <div class="hero-scroll-cue" aria-hidden="true">
      <span></span>
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
  padding: 7rem 0 5rem;
  background: radial-gradient(120% 100% at 50% 0%, #23392f 0%, #16241f 55%, #0f1a16 100%);
  overflow: hidden;
  color: #fffdf8;
}

/* Vân giấy dó mờ nhẹ + khói phủ lên nền tối */
.hero-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(250, 246, 236, 0.05) 1px, transparent 1px);
  background-size: 3px 3px;
  opacity: 0.5;
  pointer-events: none;
}

.hero-section :deep(.mist-layer)::before {
  background: radial-gradient(circle, rgba(185, 122, 69, 0.22), transparent 70%);
  mix-blend-mode: screen;
}
.hero-section :deep(.mist-layer)::after {
  background: radial-gradient(circle, rgba(47, 111, 99, 0.28), transparent 70%);
  mix-blend-mode: screen;
}

.taiji-watermark {
  position: absolute;
  top: 50%;
  right: 4%;
  width: min(46vw, 620px);
  height: min(46vw, 620px);
  transform: translateY(-50%);
  color: rgba(233, 216, 179, 0.08);
  animation: taijiWatermarkSpin 90s linear infinite;
  /* pointer-events: none; */
}
@keyframes taijiWatermarkSpin {
  from {
    transform: translateY(-50%) translateX(0) rotate(0deg);
  }
  25% {
    transform: translateY(calc(-50% - 82px)) translateX(-68px) rotate(90deg);
  }
  50% {
    transform: translateY(-50%) translateX(0) rotate(180deg);
  }
  75% {
    transform: translateY(calc(-50% + 82px)) translateX(68px) rotate(270deg);
  }
  to {
    transform: translateY(-50%) translateX(0) rotate(360deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .taiji-watermark {
    animation: none;
  }
}

.hero-content {
  position: relative;
  z-index: 1;
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero-inner {
  max-width: 760px;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.4rem 1.1rem 0.4rem 0.7rem;
  border-radius: 999px;
  background: rgba(250, 246, 236, 0.08);
  border: 1px solid rgba(233, 216, 179, 0.3);
  color: var(--gold-light);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  width: fit-content;
}
.eyebrow-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--gold-light);
  box-shadow: 0 0 8px var(--gold-light);
}

.hero-inner h1 {
  display: flex;
  flex-direction: column;
  font-size: clamp(2.6rem, 5.4vw, 4.4rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: #fffdf8;
}
.hero-sub-title {
  margin-top: 0.25rem;
  font-size: clamp(1.4rem, 2.4vw, 2rem);
  font-weight: 500;
  font-style: italic;
  color: var(--gold-light);
}

.hero-description {
  font-size: 1.12rem;
  color: rgba(250, 246, 236, 0.78);
  max-width: 560px;
  line-height: 1.85;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
  align-items: center;
}

/* Triết lý Thái Cực – dải 4 mốc: Thái Cực -> Lưỡng Nghi -> Tứ Tượng -> Bát Quái */
.taiji-philosophy {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-top: 1.6rem;
  padding-top: 1.6rem;
  border-top: 1px solid rgba(250, 246, 236, 0.12);
}
.ph-step {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(250, 246, 236, 0.85);
  font-size: 0.9rem;
}
.ph-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid var(--gold-light);
  color: var(--gold-light);
  font-family: var(--font-serif-vn);
  font-size: 0.95rem;
}
.ph-label {
  font-weight: 500;
  white-space: nowrap;
}
.ph-arrow {
  color: rgba(233, 216, 179, 0.5);
}

.hero-scroll-cue {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  width: 22px;
  height: 36px;
  border: 1px solid rgba(250, 246, 236, 0.35);
  border-radius: 999px;
  z-index: 1;
}
.hero-scroll-cue span {
  display: block;
  width: 4px;
  height: 8px;
  margin: 6px auto 0;
  border-radius: 999px;
  background: var(--gold-light);
  animation: scrollCue 1.8s ease-in-out infinite;
}
@keyframes scrollCue {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  70% {
    transform: translateY(14px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 0;
  }
}

/* Animation fade-up */
.hero-inner > * {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeUp 0.8s var(--ease) forwards;
}
.hero-inner .eyebrow {
  animation-delay: 0.1s;
}
.hero-inner h1 {
  animation-delay: 0.2s;
}
.hero-inner .hero-description {
  animation-delay: 0.3s;
}
.hero-inner .hero-actions {
  animation-delay: 0.4s;
}
.hero-inner .taiji-philosophy {
  animation-delay: 0.5s;
}

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .hero-inner {
    max-width: 100%;
  }
  .taiji-watermark {
    opacity: 0.6;
  }
}
@media (max-width: 576px) {
  .hero-section {
    min-height: 90vh;
    padding: 6rem 0 3.5rem;
  }
  .hero-inner h1 {
    font-size: 2.3rem;
  }
  .hero-description {
    font-size: 1rem;
  }
  .hero-actions .btn {
    width: 100%;
    justify-content: center;
  }
  .taiji-philosophy {
    gap: 0.5rem;
  }
  .ph-label {
    display: none;
  }
}
</style>
