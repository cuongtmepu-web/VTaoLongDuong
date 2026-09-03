<template>
  <DefaultLayout>
    <div class="doctors-page py-5">
      <div class="mist-layer"></div>
      <div class="container">
        <div class="page-header">
          <span class="eyebrow-tag">Đội ngũ</span>
          <h2 class="text-center mb-2">Đội ngũ bác sĩ</h2>
          <p class="text-center page-sub mb-3">Đội ngũ bác sĩ giàu kinh nghiệm, tận tâm với nghề</p>
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

        <div v-if="loading" class="text-center py-5 doctors-page-loading">
          <div class="spinner-border text-primary"></div>
        </div>

        <div v-else-if="doctors.length === 0" class="text-center py-5">
          <p class="text-muted">Chưa có thông tin bác sĩ</p>
        </div>

        <div v-else class="row g-4">
          <div class="col-md-4" v-for="doctor in doctors" :key="doctor.doctorId">
            <div class="doctor-card">
              <div class="doctor-image">
                <img
                  :src="doctor.avatarUrl || '/images/doctor-default.jpg'"
                  :alt="doctor.fullName"
                  class="img-fluid rounded-circle"
                />
                <span v-if="doctor.isAvailable" class="status-badge available">Online</span>
                <span v-else class="status-badge offline">Offline</span>
              </div>
              <div class="doctor-info text-center">
                <h4>{{ doctor.fullName }}</h4>
                <p class="text-muted">{{ doctor.specialization }}</p>
                <p class="text-primary">{{ doctor.yearsOfExperience }} năm kinh nghiệm</p>
                <p class="text-success fw-bold">{{ formatCurrency(doctor.consultationFee) }}</p>
                <div class="d-flex justify-content-center gap-2">
                  <button
                    class="btn btn-primary"
                    @click="bookAppointment(doctor.doctorId)"
                    :disabled="!doctor.isAvailable"
                  >
                    Đặt lịch
                  </button>
                  <button class="btn btn-outline-secondary" @click="viewDoctor(doctor.doctorId)">
                    Xem hồ sơ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useAuthStore } from '@/api/stores/auth'
import { doctorApi } from '@/api/doctor'
import type { Doctor } from '@/api/types/doctor'
import { useToast } from '@erag/vue-toastification'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const loading = ref(false)
const doctors = ref<Doctor[]>([])

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

const fetchDoctors = async () => {
  loading.value = true
  try {
    const response = await doctorApi.getAll()
    if (response.data.success) {
      doctors.value = response.data.data
    }
  } catch (error) {
    toast.error('Không thể tải danh sách bác sĩ')
  } finally {
    loading.value = false
  }
}

const bookAppointment = (doctorId: number) => {
  if (!authStore.isAuthenticated) {
    toast.warning('Vui lòng đăng nhập để đặt lịch')
    router.push('/login')
    return
  }
  router.push(`/user/appointments/book?doctorId=${doctorId}`)
}

const viewDoctor = (doctorId: number) => {
  router.push(`/bac-si/${doctorId}`)
}

onMounted(() => {
  fetchDoctors()
})
</script>

<style scoped>
.doctors-page {
  position: relative;
  padding: 7rem 0 4rem;
  background: linear-gradient(180deg, var(--soft-peach) 0%, var(--bg) 100%);
  min-height: 100vh;
  overflow: hidden;
}

.page-header {
  text-align: center;
  margin-bottom: 2.6rem;
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
.page-header h2 {
  font-family: var(--font-heading);
  font-size: clamp(2.2rem, 3.4vw, 3rem);
  color: var(--text);
  font-weight: 600;
}
.page-sub {
  color: var(--text-soft);
  font-size: 1rem;
}
.page-header .section-divider {
  margin-top: 0.6rem;
}

.doctor-card {
  background: var(--surface);
  border-radius: 22px;
  padding: 2.1rem 1.5rem 1.8rem;
  text-align: center;
  border: 1px solid var(--surface-border);
  box-shadow: 0 12px 24px rgba(28, 38, 32, 0.04);
  transition: all 0.35s var(--ease);
  height: 100%;
}
.doctor-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 18px 32px rgba(28, 38, 32, 0.1);
  border-color: var(--gold-light);
}
.doctor-image {
  position: relative;
  width: 130px;
  height: 130px;
  margin: 0 auto 1.1rem;
}
.doctor-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid var(--gold-light);
}
.doctor-card:hover .doctor-image img {
  border-color: var(--primary);
}
.status-badge {
  position: absolute;
  bottom: 4px;
  right: 6px;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  border: 2px solid var(--surface);
}
.status-badge.available {
  background: var(--primary-light);
  color: var(--primary-dark);
}
.status-badge.offline {
  background: var(--secondary-light);
  color: var(--secondary-dark);
}
.doctor-info h4 {
  font-weight: 700;
  color: var(--text);
  margin-bottom: 0.2rem;
}
.doctor-info .text-primary {
  color: var(--primary) !important;
}
.doctor-info .text-success {
  color: var(--gold) !important;
}
</style>
