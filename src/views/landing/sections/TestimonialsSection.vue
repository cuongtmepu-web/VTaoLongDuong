<template>
  <section class="testimonials-section py-5">
    <div class="mist-layer"></div>
    <div class="container">
      <div class="testimonials-header">
        <span class="eyebrow-tag">Cảm nhận</span>
        <h2 class="text-center section-title">
          {{ sectionData.title || 'Cảm nhận của khách hàng' }}
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
              <div style="font-size: 11px">{{ testimonial.date }}</div>
              <i
                v-for="star in 5"
                :key="star"
                :class="star <= testimonial.rating ? 'bi bi-star-fill active' : 'bi bi-star'"
              ></i>
            </div>
            <p class="testimonial-content">
              {{ testimonial.content }}
            </p>
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
debugger
const defaultTestimonials: Testimonial[] = [
  {
    name: 'Nguyễn Thị Hương',
    content:
      'Tôi đã điều trị tại Tảo Long Đường được 3 tháng, sức khỏe của tôi đã cải thiện rõ rệt. Bác sĩ rất tận tâm và chu đáo.',
    rating: 5,
    role: 'Khách hàng',
    date: '2024-01-15',
  },
  // {
  //   name: 'Trần Văn Minh',
  //   content:
  //     'Phương pháp điều trị của Tảo Long Đường rất hiệu quả. Tôi đã giới thiệu cho nhiều người thân và bạn bè.',
  //   rating: 5,
  //   role: 'Khách hàng',
  //   date: '2024-01-10',
  // },
  // {
  //   name: 'Lê Thị Lan',
  //   content:
  //     'Dịch vụ tuyệt vời, nhân viên thân thiện, bác sĩ chuyên nghiệp. Tôi rất hài lòng với kết quả điều trị.',
  //   rating: 4,
  //   role: 'Khách hàng',
  //   date: '2024-01-05',
  // },
  // {
  //   name: 'Phạm Văn Đức',
  //   content:
  //     'Sau khi điều trị tại Tảo Long Đường, bệnh của tôi đã thuyên giảm nhiều. Cảm ơn đội ngũ bác sĩ rất nhiều!',
  //   rating: 5,
  //   role: 'Khách hàng',
  //   date: '2023-12-20',
  // },
  // {
  //   name: 'Nguyễn Thị Mai',
  //   content:
  //     'Môi trường phòng khám sạch sẽ, thoải mái. Bác sĩ rất tận tình giải thích và hướng dẫn điều trị.',
  //   rating: 4,
  //   role: 'Khách hàng',
  //   date: '2023-12-15',
  // },
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
  position: relative;
  padding: 5.5rem 0;
  background: linear-gradient(180deg, var(--soft-mint) 0%, var(--surface) 100%);
  border: none;
  overflow: hidden;
}

.testimonials-header {
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
.testimonials-header .section-title {
  display: inline-block;
}
.testimonials-header .section-title::after {
  display: none;
}
.testimonials-header .section-divider {
  margin-top: 1rem;
}

.testimonial-card {
  position: relative;
  background: var(--surface);
  padding: 2.2rem 1.7rem 1.8rem;
  border-radius: 22px;
  border: 1px solid var(--surface-border);
  box-shadow: 0 12px 24px rgba(28, 38, 32, 0.04);
  transition: all 0.35s var(--ease);
  height: 100%;
}
.testimonial-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 32px rgba(28, 38, 32, 0.1);
  border-color: var(--gold-light);
}
.testimonial-card::before {
  content: '\201C';
  position: absolute;
  top: 0.6rem;
  right: 1.2rem;
  font-family: var(--font-heading);
  font-size: 3.4rem;
  line-height: 1;
  color: var(--gold-light);
  opacity: 0.7;
}
.testimonial-rating {
  color: var(--gold);
  font-size: 0.95rem;
  margin-bottom: 0.9rem;
}
.testimonial-rating i {
  color: var(--surface-border);
}
.testimonial-rating i.active {
  color: var(--gold);
}
.testimonial-content {
  color: var(--text-soft);
  line-height: 1.75;
  font-size: 0.95rem;
  margin-bottom: 1.3rem;
  font-style: italic;
}
.testimonial-author {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  border-top: 1px solid var(--surface-border);
  padding-top: 1rem;
}
.author-avatar img {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--gold-light);
}
.author-info h6 {
  font-weight: 600;
  margin: 0;
  color: var(--text);
}
.author-info small {
  font-size: 0.85rem;
  color: var(--text-muted);
}

@media (max-width: 576px) {
  .testimonials-section {
    padding: 4rem 0;
  }
}
</style>
