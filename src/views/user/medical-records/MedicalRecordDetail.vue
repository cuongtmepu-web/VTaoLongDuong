<template>
  <UserLayout>
    <div class="medical-record-detail">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Chi tiết hồ sơ bệnh án</h2>
        <router-link to="/user/medical-records" class="btn btn-secondary">
          <i class="bi bi-arrow-left"></i> Quay lại
        </router-link>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
      </div>

      <div v-else-if="record" class="row">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-body">
              <div class="record-header d-flex justify-content-between align-items-center mb-4">
                <h4>Hồ sơ #{{ record.medicalRecordId }}</h4>
                <span class="badge bg-success">Hoàn thành</span>
              </div>

              <div class="record-info">
                <div class="row g-4">
                  <div class="col-md-6">
                    <div class="info-item">
                      <label class="text-muted">Ngày khám</label>
                      <p class="fw-bold">{{ formatDate(record.recordDate) }}</p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="info-item">
                      <label class="text-muted">Bác sĩ điều trị</label>
                      <p class="fw-bold">{{ record.doctorName }}</p>
                    </div>
                  </div>
                </div>

                <hr />

                <div class="info-item">
                  <label class="text-muted">Chẩn đoán</label>
                  <p>{{ record.diagnosis || 'Chưa cập nhật' }}</p>
                </div>

                <div class="info-item">
                  <label class="text-muted">Triệu chứng</label>
                  <p>{{ record.symptoms || 'Chưa cập nhật' }}</p>
                </div>

                <div class="info-item">
                  <label class="text-muted">Chẩn đoán Đông y</label>
                  <p>{{ record.traditionalDiagnosis || 'Chưa cập nhật' }}</p>
                </div>

                <div class="info-item">
                  <label class="text-muted">Phác đồ điều trị</label>
                  <p>{{ record.treatmentPlan || 'Chưa cập nhật' }}</p>
                </div>

                <div class="info-item" v-if="record.followUpDate">
                  <label class="text-muted">Ngày tái khám</label>
                  <p class="fw-bold text-primary">{{ formatDate(record.followUpDate) }}</p>
                </div>

                <div class="info-item">
                  <label class="text-muted">Ghi chú</label>
                  <p>{{ record.notes || 'Không có' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <!-- Prescriptions -->
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Đơn thuốc</h5>
            </div>
            <div class="card-body">
              <div v-if="!record.prescriptions || record.prescriptions.length === 0">
                <p class="text-muted text-center">Chưa có đơn thuốc</p>
              </div>
              <div v-else>
                <div
                  v-for="(prescription, index) in record.prescriptions"
                  :key="prescription.prescriptionId"
                  class="prescription-item border-bottom py-2"
                  :class="{ 'border-bottom-0': index === record.prescriptions.length - 1 }"
                >
                  <h6>{{ prescription.medicineName }}</h6>
                  <small class="text-muted d-block">
                    Liều lượng: {{ prescription.dosage || 'Chưa cập nhật' }}
                  </small>
                  <small class="text-muted d-block">
                    Số lượng: {{ prescription.quantity }} {{ prescription.unit || '' }}
                  </small>
                  <small class="text-muted d-block" v-if="prescription.instructions">
                    Cách dùng: {{ prescription.instructions }}
                  </small>
                  <small class="text-primary fw-bold" v-if="prescription.totalPrice">
                    {{ formatCurrency(prescription.totalPrice) }}
                  </small>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="card mt-3">
            <div class="card-body">
              <div class="d-grid gap-2">
                <button class="btn btn-outline-primary" @click="printRecord">
                  <i class="bi bi-printer"></i> In hồ sơ
                </button>
                <button class="btn btn-outline-success" @click="downloadRecord">
                  <i class="bi bi-download"></i> Tải xuống
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-5">
        <i class="bi bi-file-earmark-x display-1 text-muted"></i>
        <h4 class="mt-3">Không tìm thấy hồ sơ</h4>
        <router-link to="/user/medical-records" class="btn btn-primary mt-3">
          Quay lại danh sách
        </router-link>
      </div>
    </div>
  </UserLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UserLayout from '@/layouts/UserLayout.vue'
import { medicalRecordApi } from '@/api/medicalRecord'
import type { MedicalRecord } from '@/api/types/medicalRecord'
import { useToast } from '@erag/vue-toastification'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const loading = ref(false)
const record = ref<MedicalRecord | null>(null)

const formatDate = (date: string) => {
  if (!date) return ''
  return dayjs(date).format('DD/MM/YYYY')
}

const formatCurrency = (amount: number | null | undefined) => {
  if (!amount) return ''
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

const fetchRecord = async () => {
  const id = route.params.id as string
  if (!id) return

  loading.value = true
  try {
    const response = await medicalRecordApi.getById(parseInt(id))
    if (response.data.success) {
      record.value = response.data.data
    }
  } catch (error) {
    toast.error('Không thể tải hồ sơ bệnh án')
    router.push('/user/medical-records')
  } finally {
    loading.value = false
  }
}

const printRecord = () => {
  window.print()
}

const downloadRecord = () => {
  toast.info('Chức năng đang được phát triển')
}

onMounted(() => {
  fetchRecord()
})
</script>

<style scoped>
.medical-record-detail {
  padding: 20px;
}

.info-item {
  margin-bottom: 15px;
}

.info-item label {
  display: block;
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 2px;
}

.info-item p {
  margin: 0;
  font-size: 1rem;
}

.prescription-item {
  padding: 10px 0;
}

.prescription-item:last-child {
  border-bottom: none !important;
}
</style>
