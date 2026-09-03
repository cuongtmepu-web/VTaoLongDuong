<template>
  <section class="doctors-section py-5">
    <div class="mist-layer"></div>
    <div class="container">
      <div class="doctors-header">
        <span class="eyebrow-tag">Đội ngũ</span>
        <h2 class="text-center section-title">
          {{ sectionData.title || 'Đội ngũ bác sĩ' }}
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
              <h5>{{ doctor.fullName }}</h5>
              <p class="text-muted small">{{ doctor.specialization }}</p>
              <p class="text-primary small">{{ doctor.yearsOfExperience }} năm kinh nghiệm</p>
              <div class="d-flex justify-content-center gap-2">
                <button
                  class="btn btn-sm btn-primary"
                  @click="bookAppointment(doctor.doctorId)"
                  :disabled="!doctor.isAvailable"
                >
                  Đặt lịch
                </button>
                <button
                  class="btn btn-sm btn-outline-secondary"
                  @click="viewDoctor(doctor.doctorId)"
                >
                  Xem hồ sơ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLandingStore } from '@/api/stores/landing'
import { useAuthStore } from '@/api/stores/auth'
import { doctorApi } from '@/api/doctor'
import type { Doctor } from '@/api/types/doctor'
import { useRouter } from 'vue-router'
import { useToast } from '@erag/vue-toastification'

const landingStore = useLandingStore()
const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const sectionData = computed(() => landingStore.getSection('doctors'))
const loading = ref(false)
const doctors = ref<Doctor[]>([])

const fetchDoctors = async () => {
  loading.value = true
  try {
    const response = await doctorApi.getTopDoctors(6)
    if (response.data.success) {
      // Convert to full Doctor type
      const topDoctors = response.data.data
      const fullDoctors = await Promise.all(
        topDoctors.map(async (d) => {
          const res = await doctorApi.getById(d.doctorId)
          return res.data.success ? res.data.data : null
        }),
      )
      doctors.value = fullDoctors.filter((d) => d !== null) as Doctor[]
    }
  } catch (error) {
    console.error('Failed to fetch doctors:', error)
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
.doctors-section {
  position: relative;
  padding: 5.5rem 0;
  background: linear-gradient(180deg, var(--surface) 0%, var(--soft-peach) 100%);
  border: none;
  overflow: hidden;
}

.doctors-header {
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
.doctors-header .section-title {
  display: inline-block;
}
.doctors-header .section-title::after {
  display: none;
}
.doctors-header .section-divider {
  margin-top: 1rem;
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
  width: 120px;
  height: 120px;
  margin: 0 auto 1.1rem;
}
.doctor-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid var(--gold-light);
  box-shadow: var(--shadow-sm);
  transition: border-color 0.3s var(--ease);
}
.doctor-card:hover .doctor-image img {
  border-color: var(--primary);
}
.status-badge {
  position: absolute;
  bottom: 2px;
  right: 4px;
  padding: 0.18rem 0.6rem;
  border-radius: 999px;
  font-size: 0.65rem;
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
.doctor-info h5 {
  font-weight: 700;
  margin-bottom: 0.2rem;
  color: var(--text);
}
.doctor-info .text-primary {
  color: var(--primary) !important;
}

@media (max-width: 576px) {
  .doctors-section {
    padding: 4rem 0;
  }
}
</style>
