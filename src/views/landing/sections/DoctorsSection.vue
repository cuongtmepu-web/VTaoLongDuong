<template>
  <section class="doctors-section py-5 bg-light">
    <div class="container">
      <h2 class="text-center section-title mb-5">
        {{ sectionData.title || 'Đội ngũ bác sĩ' }}
      </h2>

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
  background: #f8f9fa;
}

.section-title {
  font-size: 2.5rem;
  font-weight: bold;
}

.doctor-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s;
}

.doctor-card:hover {
  transform: translateY(-5px);
}

.doctor-image {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto 15px;
}

.doctor-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 4px solid #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.status-badge {
  position: absolute;
  bottom: 5px;
  right: 5px;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: bold;
  color: white;
}

.status-badge.available {
  background: #28a745;
}

.status-badge.offline {
  background: #dc3545;
}
</style>
