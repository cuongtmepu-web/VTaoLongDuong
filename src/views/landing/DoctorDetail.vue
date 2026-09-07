<template>
  <DefaultLayout>
    <div class="doctor-detail-page py-5">
      <div class="container">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>

        <div v-else-if="doctor" class="doctor-detail">
          <div class="doctor-detail-header">
            <span class="eyebrow-tag">Xem hồ sơ</span>
            <h2>Hồ sơ chi tiết</h2>
            <p class="text-center page-sub mb-3">Thông tin chi tiết về {{ doctor.fullName }}</p>
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
            <div class="col-md-4">
              <div class="doctor-profile-card text-center">
                <img
                  :src="doctor.avatarUrl || '/images/doctor-default.jpg'"
                  :alt="doctor.fullName"
                  class="rounded-circle mb-3"
                  width="200"
                  height="200"
                />
                <h3>{{ doctor.fullName }}</h3>
                <p class="text-muted">{{ doctor.specialization }}</p>
                <span
                  :class="doctor.isAvailable ? 'text-success' : 'text-danger'"
                  class="badge fs-6"
                >
                  {{ doctor.isAvailable ? 'Đang hoạt động' : 'Đang bận' }}
                </span>
                <hr />
                <div class="text-start">
                  <p><strong>Kinh nghiệm:</strong> {{ doctor.yearsOfExperience }} năm</p>
                  <p><strong>Phí tư vấn:</strong> {{ formatCurrency(doctor.consultationFee) }}</p>
                  <p><strong>Email:</strong> {{ doctor.email || 'Chưa cập nhật' }}</p>
                  <p><strong>Điện thoại:</strong> {{ doctor.phone || 'Chưa cập nhật' }}</p>
                </div>
                <button
                  class="btn btn-primary w-100 mt-3"
                  @click="bookAppointment"
                  :disabled="!doctor.isAvailable"
                >
                  Đặt lịch hẹn
                </button>
              </div>
            </div>

            <div class="col-md-8">
              <div class="card">
                <div class="card-body">
                  <h4 class="mb-3">Giới thiệu</h4>
                  <div class="doctor-bio" v-html="doctor.biography || 'Chưa có thông tin'"></div>

                  <h4 class="mt-4 mb-3">Lịch làm việc</h4>
                  <div class="schedule-grid">
                    <div v-for="(hours, day) in schedule" :key="day" class="schedule-item">
                      <span class="day">{{ getDayName(String(day)) }}</span>
                      <span class="hours">{{ hours.length > 0 ? hours.join(', ') : 'Nghỉ' }}</span>
                    </div>
                  </div>

                  <h4 class="mt-4 mb-3">Đánh giá của bệnh nhân</h4>
                  <div v-if="reviews.length > 0">
                    <div v-for="review in reviews" :key="review.id" class="review-item">
                      <div class="d-flex justify-content-between">
                        <strong>{{ review.patientName }}</strong>
                        <span class="text-warning">
                          <i v-for="star in review.rating" :key="star" class="bi bi-star-fill"></i>
                        </span>
                      </div>
                      <p class="text-muted small">{{ review.content }}</p>
                    </div>
                  </div>
                  <p v-else class="text-muted">Chưa có đánh giá</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-5">
          <i class="bi bi-person-x display-1 text-muted"></i>
          <h4 class="mt-3">Không tìm thấy bác sĩ</h4>
          <router-link to="/bac-si" class="btn btn-primary mt-3">Quay lại</router-link>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useAuthStore } from '@/api/stores/auth'
import { doctorApi } from '@/api/doctor'
import type { Doctor } from '@/api/types/doctor'
import { useToast } from '@erag/vue-toastification'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const loading = ref(false)
const doctor = ref<Doctor | null>(null)

const schedule = computed(() => {
  if (!doctor.value?.scheduleJson) return {}
  try {
    return JSON.parse(doctor.value.scheduleJson)
  } catch {
    return {}
  }
})

const reviews = ref([
  {
    id: 1,
    patientName: 'Nguyễn Thị Hương',
    rating: 5,
    content: 'Bác sĩ rất tận tâm và chuyên nghiệp. Tôi đã khỏi bệnh sau 2 tháng điều trị.',
  },
  {
    id: 2,
    patientName: 'Trần Văn Minh',
    rating: 5,
    content: 'Phương pháp điều trị rất hiệu quả. Cảm ơn bác sĩ!',
  },
])

const getDayName = (day: string) => {
  const days: Record<string, string> = {
    Monday: 'Thứ 2',
    Tuesday: 'Thứ 3',
    Wednesday: 'Thứ 4',
    Thursday: 'Thứ 5',
    Friday: 'Thứ 6',
    Saturday: 'Thứ 7',
    Sunday: 'Chủ nhật',
  }
  return days[day] || day
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

const fetchDoctor = async () => {
  const id = route.params.id as string
  if (!id) return

  loading.value = true
  try {
    const response = await doctorApi.getById(parseInt(id))
    if (response.data.success) {
      doctor.value = response.data.data
    }
  } catch (error) {
    toast.error('Không thể tải thông tin bác sĩ')
  } finally {
    loading.value = false
  }
}

const bookAppointment = () => {
  if (!authStore.isAuthenticated) {
    toast.warning('Vui lòng đăng nhập để đặt lịch')
    router.push('/login')
    return
  }
  router.push(`/user/appointments/book?doctorId=${doctor.value?.doctorId}`)
}

onMounted(() => {
  fetchDoctor()
})
</script>

<style scoped>
.doctor-detail-page {
  position: relative;
  padding: 7rem 0 4rem;
  background: linear-gradient(180deg, var(--soft-green) 0%, var(--bg) 100%);
  min-height: 100vh;
  overflow: hidden;
}

.doctor-detail-page > .container {
  width: 80%;
  max-width: none;
  margin: 0 auto;
}

.doctor-detail {
  position: relative;
  z-index: 1;
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

.page-sub {
  color: var(--text-soft);
  font-size: 1rem;
}

.doctor-detail .section-divider {
  margin-top: 0.6rem;
}

.doctor-detail .breadcrumb {
  margin-bottom: 1.8rem;
  color: var(--text-muted);
}
.doctor-detail .breadcrumb-item.active {
  color: var(--text-soft);
}
.doctor-detail .breadcrumb-item a:hover {
  color: var(--primary);
}

.doctor-profile-card {
  background: var(--surface);
  padding: 2rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--surface-border);
  box-shadow: var(--shadow-sm);
  text-align: center;
}
.doctor-profile-card img {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--primary-light);
  margin: 0 auto 1rem;
}
.doctor-detail-header {
  text-align: center;
  margin-bottom: 2.6rem;
}
.doctor-detail-header h2 {
  margin: 0;
  color: var(--text);
  font-family: var(--font-heading);
  font-size: clamp(2.2rem, 3.4vw, 3rem);
  font-weight: 600;
}
.doctor-profile-card h3 {
  font-weight: 700;
}
.doctor-profile-card hr {
  border-color: var(--surface-border);
  opacity: 1;
  margin: 1.5rem 0;
}
.doctor-profile-card p {
  color: var(--text-soft);
  margin-bottom: 0.7rem;
}
.doctor-profile-card strong {
  color: var(--text);
}
.doctor-profile-card .text-success {
  background: var(--primary-light);
  color: var(--primary-dark) !important;
}
.doctor-profile-card .text-danger {
  background: var(--secondary-light);
  color: var(--secondary-dark) !important;
}

.doctor-info-card {
  background: var(--surface);
  padding: 2rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--surface-border);
  box-shadow: var(--shadow-sm);
}

.doctor-detail .card {
  border: 1px solid var(--surface-border);
}
.doctor-detail .card-body {
  padding: 2rem;
}
.doctor-detail h4 {
  color: var(--text);
  font-weight: 700;
}
.doctor-bio {
  color: var(--text-soft);
  line-height: 1.8;
}
.schedule-grid {
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  padding: 0.35rem 1rem;
}

.schedule-item {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.7rem 0;
  border-bottom: 1px solid var(--surface-border);
}
.schedule-item:last-child {
  border-bottom: none;
}
.schedule-item .day {
  color: var(--text);
  font-weight: 600;
}
.schedule-item .hours {
  color: var(--text-soft);
  text-align: right;
}
.review-item {
  padding: 1rem 0;
  border-bottom: 1px solid var(--surface-border);
}
.review-item:last-child {
  border-bottom: none;
}
.review-item strong {
  color: var(--text);
}

@media (max-width: 576px), (max-width: 786px), (max-width: 1024px) {
  .doctor-detail-page {
    padding: 6rem 0 3rem;
  }

  .doctor-detail-page > .container {
    width: calc(100% - 30px);
  }

  .doctor-detail .card-body,
  .doctor-profile-card {
    padding: 1.5rem;
  }

  .schedule-item {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.15rem;
  }

  .schedule-item .hours {
    text-align: left;
  }
}
</style>
