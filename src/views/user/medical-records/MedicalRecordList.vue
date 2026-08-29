<template>
  <UserLayout>
    <div class="medical-record-list">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Hồ sơ bệnh án</h2>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
      </div>

      <div v-else-if="records.length === 0" class="text-center py-5">
        <i class="bi bi-file-medical display-1 text-muted"></i>
        <h4 class="mt-3">Chưa có hồ sơ bệnh án</h4>
        <p class="text-muted">
          Bạn chưa có hồ sơ bệnh án nào. Hãy đặt lịch khám để được tạo hồ sơ.
        </p>
        <router-link to="/user/appointments/book" class="btn btn-primary">
          Đặt lịch ngay
        </router-link>
      </div>

      <div v-else class="row g-4">
        <div class="col-md-6" v-for="record in records" :key="record.medicalRecordId">
          <div class="record-card card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h5 class="mb-2">Hồ sơ #{{ record.medicalRecordId }}</h5>
                  <p class="text-muted small">
                    <i class="bi bi-calendar3"></i> {{ formatDate(record.recordDate) }}
                  </p>
                  <p class="text-muted small">
                    <i class="bi bi-person"></i> Bác sĩ: {{ record.doctorName }}
                  </p>
                </div>
                <span class="badge bg-success">Hoàn thành</span>
              </div>

              <div class="record-summary mt-3">
                <p class="mb-1">
                  <strong>Chẩn đoán:</strong> {{ record.diagnosis || 'Chưa cập nhật' }}
                </p>
                <p class="mb-1">
                  <strong>Triệu chứng:</strong> {{ record.symptoms || 'Chưa cập nhật' }}
                </p>
                <p class="mb-0" v-if="record.followUpDate">
                  <strong>Ngày tái khám:</strong> {{ formatDate(record.followUpDate) }}
                </p>
              </div>

              <div class="mt-3">
                <router-link
                  :to="`/user/medical-records/${record.medicalRecordId}`"
                  class="btn btn-outline-primary btn-sm"
                >
                  <i class="bi bi-eye"></i> Xem chi tiết
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UserLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UserLayout from '@/layouts/UserLayout.vue'
import { medicalRecordApi } from '@/api/medicalRecord'
import type { MedicalRecord } from '@/api/types/medicalRecord'
import { useToast } from '@erag/vue-toastification'
import dayjs from 'dayjs'

const toast = useToast()
const loading = ref(false)
const records = ref<MedicalRecord[]>([])

const formatDate = (date: string) => {
  if (!date) return ''
  return dayjs(date).format('DD/MM/YYYY')
}

const fetchRecords = async () => {
  loading.value = true
  try {
    const response = await medicalRecordApi.getAll()
    if (response.data.success) {
      records.value = response.data.data
    }
  } catch (error) {
    toast.error('Không thể tải hồ sơ bệnh án')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchRecords()
})
</script>

<style scoped>
.medical-record-list {
  padding: 20px;
}

.record-card {
  transition: transform 0.2s;
}

.record-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.record-summary {
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
}

.record-summary p {
  font-size: 0.9rem;
  margin-bottom: 5px;
}
</style>
