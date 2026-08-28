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
  background: white;
}

.section-title {
  font-size: 2.5rem;
  font-weight: bold;
}

.service-card {
  padding: 30px 20px;
  border-radius: 10px;
  transition: all 0.3s;
  border: 1px solid #eee;
}

.service-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-color: #ffc107;
}

.service-icon {
  font-size: 3rem;
  color: #ffc107;
  margin-bottom: 15px;
}

.service-icon i {
  display: inline-block;
}
</style>
