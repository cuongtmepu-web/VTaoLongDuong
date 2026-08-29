<template>
  <section class="services-section py-5">
    <div class="container">
      <h2 class="text-center section-title mb-5">
        {{ sectionData.title || 'Dịch vụ của chúng tôi' }}
      </h2>

      <div class="row g-4">
        <div class="col-md-4" v-for="(service, index) in services" :key="index">
          <div class="service-card text-center">
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
    icon: 'bi bi-syringe',
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
    icon: 'bi bi-apple',
  },
]

const services = computed(() => {
  return sectionData.value.items || defaultServices
})
</script>

<style scoped>
.services-section {
  padding: 5rem 0;
  background: var(--bg);
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}

.service-card {
  background: var(--surface);
  padding: 2rem 1.8rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--surface-border);
  box-shadow: var(--shadow-sm);
  transition: all 0.35s var(--ease);
  text-align: center;
}
.service-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-light);
}
.service-card .icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  background: var(--primary-light);
  color: var(--primary);
  font-size: 2rem;
}
.service-card h4 {
  font-weight: 700;
  margin-bottom: 0.6rem;
}
.service-card p {
  color: var(--text-soft);
  line-height: 1.7;
}

@media (max-width: 992px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 576px) {
  .services-grid {
    grid-template-columns: 1fr;
  }
}
</style>
