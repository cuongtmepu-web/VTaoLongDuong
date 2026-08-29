<template>
  <DefaultLayout>
    <div class="doctor-detail-page py-5">
      <div class="container">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>

        <div v-else-if="doctor" class="doctor-detail">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><router-link to="/">Trang chủ</router-link></li>
              <li class="breadcrumb-item"><router-link to="/bac-si">Bác sĩ</router-link></li>
              <li class="breadcrumb-item active">{{ doctor.fullName }}</li>
            </ol>
          </nav>

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
  background: #f8f9fa;
  min-height: 100vh;
}

.doctor-profile-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
}

.schedule-grid {
  display: grid;
  gap: 10px;
}

.schedule-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
}

.schedule-item .day {
  font-weight: 600;
}

.review-item {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 10px;
}
</style>
