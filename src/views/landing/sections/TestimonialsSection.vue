<template>
  <section class="testimonials-section py-5">
    <div class="container">
      <h2 class="text-center section-title mb-5">
        {{ sectionData.title || 'Cảm nhận của khách hàng' }}
      </h2>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
      </div>

      <div v-else-if="testimonials.length === 0" class="text-center py-5">
        <p class="text-muted">Chưa có đánh giá nào</p>
      </div>

      <div v-else class="row g-4">
        <div class="col-md-4" v-for="(testimonial, index) in displayedTestimonials" :key="index">
          <article class="testimonial-card">
            <div class="testimonial-rating" aria-label="Đánh giá">
              <i
                v-for="star in 5"
                :key="star"
                :class="star <= testimonial.rating ? 'bi bi-star-fill active' : 'bi bi-star'"
              ></i>
            </div>
            <p class="testimonial-content">{{ testimonial.content }}</p>
            <div class="testimonial-author">
              <div class="author-avatar">
                <img
                  :src="testimonial.avatar || '/images/default-avatar.jpg'"
                  :alt="testimonial.name"
                  width="48"
                  height="48"
                />
              </div>
              <div class="author-info">
                <h6>{{ testimonial.name }}</h6>
                <small>{{ testimonial.role || 'Khách hàng' }}</small>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div class="text-center mt-4" v-if="testimonials.length > 3">
        <button class="btn btn-outline-primary" @click="showAll = !showAll">
          {{ showAll ? 'Thu gọn' : 'Xem thêm' }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLandingStore } from '@/api/stores/landing'

interface Testimonial {
  name: string
  content: string
  rating: number
  role?: string
  avatar?: string
  date?: string
}

const landingStore = useLandingStore()
const loading = ref(false)
const showAll = ref(false)

const sectionData = computed(() => landingStore.getSection('testimonials'))

const defaultTestimonials: Testimonial[] = [
  {
    name: 'Nguyễn Thị Hương',
    content:
      'Tôi đã điều trị tại Tảo Long Đường được 3 tháng, sức khỏe của tôi đã cải thiện rõ rệt. Bác sĩ rất tận tâm và chu đáo.',
    rating: 5,
    role: 'Khách hàng',
    date: '2024-01-15',
  },
  {
    name: 'Trần Văn Minh',
    content:
      'Phương pháp điều trị của Tảo Long Đường rất hiệu quả. Tôi đã giới thiệu cho nhiều người thân và bạn bè.',
    rating: 5,
    role: 'Khách hàng',
    date: '2024-01-10',
  },
  {
    name: 'Lê Thị Lan',
    content:
      'Dịch vụ tuyệt vời, nhân viên thân thiện, bác sĩ chuyên nghiệp. Tôi rất hài lòng với kết quả điều trị.',
    rating: 4,
    role: 'Khách hàng',
    date: '2024-01-05',
  },
  {
    name: 'Phạm Văn Đức',
    content:
      'Sau khi điều trị tại Tảo Long Đường, bệnh của tôi đã thuyên giảm nhiều. Cảm ơn đội ngũ bác sĩ rất nhiều!',
    rating: 5,
    role: 'Khách hàng',
    date: '2023-12-20',
  },
  {
    name: 'Nguyễn Thị Mai',
    content:
      'Môi trường phòng khám sạch sẽ, thoải mái. Bác sĩ rất tận tình giải thích và hướng dẫn điều trị.',
    rating: 4,
    role: 'Khách hàng',
    date: '2023-12-15',
  },
]

const testimonials = computed<Testimonial[]>(() => {
  const data = sectionData.value.items || defaultTestimonials
  return data
})

const displayedTestimonials = computed(() => {
  if (showAll.value) return testimonials.value
  return testimonials.value.slice(0, 3)
})

onMounted(() => {
  // Testimonials are loaded from store
})
</script>

<style scoped>
.testimonials-section {
  padding: 5rem 0;
  background: var(--bg);
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}

.testimonial-card {
  background: var(--surface);
  padding: 1.8rem 1.6rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--surface-border);
  box-shadow: var(--shadow-sm);
  transition: all 0.35s var(--ease);
}
.testimonial-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--secondary-light);
}
.testimonial-card .stars {
  color: var(--secondary);
  font-size: 1rem;
  margin-bottom: 0.8rem;
}
.testimonial-card .content {
  color: var(--text-soft);
  line-height: 1.7;
  font-size: 0.95rem;
  margin-bottom: 1.2rem;
}
.testimonial-card .author {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  border-top: 1px solid var(--surface-border);
  padding-top: 1rem;
}
.testimonial-card .author img {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
}
.testimonial-card .author .name {
  font-weight: 600;
}
.testimonial-card .author .role {
  font-size: 0.85rem;
  color: var(--text-muted);
}

@media (max-width: 992px) {
  .testimonials-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 576px) {
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
}
</style>
