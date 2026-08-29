<template>
  <AdminLayout>
    <div class="record-list">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Quản lý hồ sơ bệnh án</h2>
        <router-link to="/admin/medical-records/create" class="btn btn-primary">
          <i class="bi bi-plus-circle"></i> Tạo hồ sơ mới
        </router-link>
      </div>

      <div class="card">
        <div class="card-body">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
          </div>
          <div v-else>
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Người dùng</th>
                    <th>Bác sĩ</th>
                    <th>Ngày khám</th>
                    <th>Chẩn đoán</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="record in records" :key="record.medicalRecordId">
                    <td>{{ record.medicalRecordId }}</td>
                    <td>{{ record.userName }}</td>
                    <td>{{ record.doctorName }}</td>
                    <td>{{ formatDate(record.recordDate) }}</td>
                    <td>{{ record.diagnosis || 'Chưa cập nhật' }}</td>
                    <td>
                      <div class="btn-group">
                        <router-link
                          :to="`/admin/medical-records/${record.medicalRecordId}/edit`"
                          class="btn btn-sm btn-outline-primary"
                        >
                          <i class="bi bi-pencil"></i>
                        </router-link>
                        <button class="btn btn-sm btn-outline-danger" @click="deleteRecord(record)">
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { adminMedicalRecordApi } from '@/api/admin/adminMedicalRecord'
import type { MedicalRecord } from '@/api/types/medicalRecord'
import { useToast } from '@erag/vue-toastification'
import dayjs from 'dayjs'

const toast = useToast()
const loading = ref(false)
const records = ref<MedicalRecord[]>([])

const formatDate = (date: string) => {
  return dayjs(date).format('DD/MM/YYYY')
}

const fetchRecords = async () => {
  loading.value = true
  try {
    const response = await adminMedicalRecordApi.getAll()
    if (response.data.success) {
      records.value = response.data.data
    }
  } catch (error) {
    toast.error('Không thể tải danh sách hồ sơ')
  } finally {
    loading.value = false
  }
}

const deleteRecord = async (record: MedicalRecord) => {
  if (!confirm(`Bạn có chắc muốn xóa hồ sơ #${record.medicalRecordId}?`)) return

  try {
    const response = await adminMedicalRecordApi.delete(record.medicalRecordId)
    if (response.data.success) {
      toast.success('Xóa hồ sơ thành công')
      await fetchRecords()
    }
  } catch (error) {
    toast.error('Xóa thất bại')
  }
}

onMounted(() => {
  fetchRecords()
})
</script>

<style scoped>
.record-list {
  padding: 20px;
}
</style>
