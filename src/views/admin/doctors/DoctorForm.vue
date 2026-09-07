<template>
  <AdminLayout>
    <div class="doctor-form">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">{{ isEdit ? 'Chỉnh sửa bác sĩ' : 'Thêm bác sĩ mới' }}</h2>
        <router-link to="/admin/doctors" class="btn btn-secondary">
          <i class="bi bi-arrow-left"></i> Quay lại
        </router-link>
      </div>

      <div class="card">
        <div class="card-body">
          <form @submit.prevent="handleSubmit">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Chọn người dùng *</label>
                <BaseSelect
                  v-model="form.userId"
                  :options="[
                    { value: null, label: 'Chọn người dùng' },
                    ...users.map((user) => ({
                      value: user.userId,
                      label: `${user.fullName} (${user.email})`,
                    })),
                  ]"
                  :disabled="isEdit"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Chuyên khoa</label>
                <input type="text" class="form-control" v-model="form.specialization" />
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Số năm kinh nghiệm *</label>
                <input
                  type="number"
                  class="form-control"
                  v-model="form.yearsOfExperience"
                  required
                  min="0"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Phí tư vấn *</label>
                <input
                  type="number"
                  class="form-control"
                  v-model="form.consultationFee"
                  required
                  min="0"
                />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Giới thiệu</label>
              <textarea class="form-control" v-model="form.biography" rows="4"></textarea>
            </div>

            <div class="mb-3">
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="form.isAvailable"
                  id="availableSwitch"
                />
                <label class="form-check-label" for="availableSwitch">Đang hoạt động</label>
              </div>
            </div>

            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-primary" :disabled="submitting">
                <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                {{ isEdit ? 'Cập nhật' : 'Thêm mới' }}
              </button>
              <router-link to="/admin/doctors" class="btn btn-secondary">Hủy</router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import { adminDoctorApi } from '@/api/admin/adminDoctor'
import { adminUserApi } from '@/api/admin/adminUser'
import type { User } from '@/api/types/auth'
import { useToast } from '@erag/vue-toastification'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const submitting = ref(false)
const users = ref<User[]>([])

const isEdit = computed(() => !!route.params.id)

const form = reactive({
  userId: null as number | null,
  specialization: '',
  yearsOfExperience: 0,
  biography: '',
  consultationFee: 0,
  isAvailable: true,
})

const fetchUsers = async () => {
  try {
    const response = await adminUserApi.getUsers({ role: 'User' })
    if (response.data.success) {
      users.value = response.data.data.data
    }
  } catch (error) {
    toast.error('Không thể tải danh sách người dùng')
  }
}

const fetchDoctor = async () => {
  const id = route.params.id as string
  if (!id) return

  try {
    const response = await adminDoctorApi.getById(parseInt(id))
    if (response.data.success) {
      const data = response.data.data
      Object.assign(form, {
        userId: data.userId,
        specialization: data.specialization || '',
        yearsOfExperience: data.yearsOfExperience,
        biography: data.biography || '',
        consultationFee: data.consultationFee,
        isAvailable: data.isAvailable,
      })
    }
  } catch (error) {
    toast.error('Không thể tải thông tin bác sĩ')
    router.push('/admin/doctors')
  }
}

const handleSubmit = async () => {
  if (!form.userId) {
    toast.warning('Vui lòng chọn người dùng')
    return
  }

  submitting.value = true
  try {
    const data = {
      userId: form.userId,
      specialization: form.specialization,
      yearsOfExperience: form.yearsOfExperience,
      biography: form.biography,
      consultationFee: form.consultationFee,
      isAvailable: form.isAvailable,
    }

    let response
    if (isEdit.value) {
      response = await adminDoctorApi.update(parseInt(route.params.id as string), data)
    } else {
      response = await adminDoctorApi.create(data)
    }

    if (response.data.success) {
      toast.success(isEdit.value ? 'Cập nhật bác sĩ thành công' : 'Thêm bác sĩ thành công')
      router.push('/admin/doctors')
    }
  } catch (error) {
    toast.error('Lưu thông tin thất bại')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchUsers()
  if (isEdit.value) {
    fetchDoctor()
  }
})
</script>

<style scoped>
.doctor-form {
  padding: 20px;
}
</style>
