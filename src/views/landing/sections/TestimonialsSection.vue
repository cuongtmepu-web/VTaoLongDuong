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
          <div class="testimonial-card">
            <div class="testimonial-rating">
              <i
                v-for="star in 5"
                :key="star"
                :class="
                  star <= testimonial.rating
                    ? 'bi bi-star-fill text-warning'
                    : 'bi bi-star text-muted'
                "
              >
              </i>
            </div>
            <p class="testimonial-content">{{ testimonial.content }}</p>
            <div class="testimonial-author">
              <div class="author-avatar">
                <img
                  :src="testimonial.avatar || '/images/default-avatar.jpg'"
                  :alt="testimonial.name"
                  class="rounded-circle"
                  width="50"
                  height="50"
                />
              </div>
              <div class="author-info">
                <h6 class="mb-0">{{ testimonial.name }}</h6>
                <small class="text-muted">{{ testimonial.role || 'Khách hàng' }}</small>
              </div>
            </div>
          </div>
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
  if (showAll.value) {
    return testimonials.value
  }
  return testimonials.value.slice(0, 3)
})

onMounted(() => {
  // Testimonials are loaded from store
})
</script>

<style scoped>
.testimonials-section {
  background: #f8f9fa;
}

.section-title {
  font-size: 2.5rem;
  font-weight: bold;
}

.testimonial-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.06);
  height: 100%;
  transition: transform 0.3s;
}

.testimonial-card:hover {
  transform: translateY(-5px);
}

.testimonial-rating {
  margin-bottom: 15px;
}

.testimonial-rating i {
  font-size: 1.1rem;
  margin-right: 2px;
}

.testimonial-content {
  color: #555;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 20px;
  min-height: 80px;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 15px;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.author-avatar img {
  object-fit: cover;
  border: 2px solid #f8f9fa;
}

.author-info h6 {
  font-weight: 600;
}

.author-info small {
  font-size: 0.8rem;
}
</style>
