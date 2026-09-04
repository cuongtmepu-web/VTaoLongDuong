<template>
  <section class="services-section py-5">
    <div class="mist-layer"></div>
    <div class="container">
      <div class="services-header">
        <span class="eyebrow-tag">Dịch vụ</span>
        <h2 class="text-center section-title">
          {{ sectionData.title || 'Dịch vụ của chúng tôi' }}
        </h2>
        <div class="section-divider">
          <span class="line"></span>
          <svg class="taiji-icon" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" stroke-width="3" />
            <path
              d="M50,3 A23.5,23.5 0 0,1 50,50 A23.5,23.5 0 0,0 50,97 A47,47 0 0,1 50,3 Z"
              fill="currentColor"
            />
            <circle cx="50" cy="26.5" r="7" fill="var(--surface)" />
            <circle cx="50" cy="73.5" r="7" fill="currentColor" />
          </svg>
          <span class="line right"></span>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-md-4" v-for="(service, index) in services" :key="index">
          <div class="service-card text-center">
            <span class="service-index">{{ String(Number(index) + 1).padStart(2, '0') }}</span>
            <div class="service-icon">
              <i :class="service.icon || 'bi bi-heart-pulse'"></i>
            </div>
            <h4>{{ service.title }}</h4>
            <p class="text-muted">{{ service.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLandingStore } from '@/api/stores/landing'

const landingStore = useLandingStore()
const sectionData = computed(() => landingStore.getSection('services'))

const defaultServices = [
  {
    title: 'Tư vấn Đông y',
    description: 'Tư vấn sức khỏe toàn diện với phương pháp Đông y',
    icon: 'bi bi-heart-pulse',
  },
  {
    title: 'Châm cứu',
    description: 'Phương pháp châm cứu cổ truyền giúp giảm đau và phục hồi sức khỏe',
    icon: 'bi bi-crosshair',
  },
  {
    title: 'Bài thuốc gia truyền',
    description: 'Các bài thuốc đặc trị được gia truyền qua nhiều thế hệ',
    icon: 'bi bi-flower1',
  },
  {
    title: 'Xoa bóp bấm huyệt',
    description: 'Kỹ thuật xoa bóp bấm huyệt giúp thư giãn và giảm stress',
    icon: 'bi bi-hand-index',
  },
  {
    title: 'Khám sức khỏe định kỳ',
    description: 'Kiểm tra và đánh giá sức khỏe định kỳ bằng phương pháp Đông y',
    icon: 'bi bi-clipboard2-pulse',
  },
  {
    title: 'Tư vấn dinh dưỡng',
    description: 'Hướng dẫn chế độ ăn uống theo y học cổ truyền',
    icon: 'bi bi-calendar2-heart',
  },
]

const services = computed(() => {
  return sectionData.value.items || defaultServices
})
</script>

<style scoped>
.services-section {
  position: relative;
  padding: 5.5rem 0;
  background: linear-gradient(180deg, var(--soft-green) 0%, var(--soft-ivory) 100%);
  border: none;
  overflow: hidden;
}

.services-header {
  text-align: center;
  margin-bottom: 3rem;
}
.eyebrow-tag {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold);
}
.services-header .section-title {
  display: inline-block;
}
.services-header .section-title::after {
  display: none;
}
.services-header .section-divider {
  margin-top: 1rem;
}

.service-card {
  position: relative;
  background: var(--surface);
  padding: 2.2rem 1.8rem 2rem;
  border-radius: 22px;
  border: 1px solid var(--surface-border);
  box-shadow: 0 12px 24px rgba(28, 38, 32, 0.04);
  transition: all 0.35s var(--ease);
  text-align: center;
  height: 100%;
}
.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 18px 32px rgba(28, 38, 32, 0.1);
  border-color: var(--gold-light);
}
.service-index {
  position: absolute;
  top: 1rem;
  right: 1.2rem;
  font-family: var(--font-heading);
  font-size: 1rem;
  color: var(--gold-light);
  font-weight: 600;
}
.service-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--primary-light);
  color: var(--primary-dark);
  font-size: 1.7rem;
  box-shadow: inset 0 0 0 1px var(--gold-light);
  transition: all 0.35s var(--ease);
}
.service-card:hover .service-icon {
  background: var(--primary);
  color: #fff;
}
.service-card h4 {
  font-weight: 700;
  margin-bottom: 0.6rem;
  color: var(--text);
}
.service-card p {
  color: var(--text-soft);
  line-height: 1.7;
  font-size: 0.95rem;
}

@media (max-width: 576px) {
  .services-section {
    padding: 4rem 0;
  }
}
</style>
