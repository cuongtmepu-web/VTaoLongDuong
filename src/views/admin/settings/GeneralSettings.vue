<template>
  <AdminLayout>
    <div class="general-settings">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Cài đặt chung</h2>
        <button class="btn btn-primary" @click="saveSettings" :disabled="saving">
          <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
          <i class="bi bi-save"></i> Lưu cài đặt
        </button>
      </div>

      <div class="row">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-body">
              <h5 class="mb-3">Thông tin phòng khám</h5>

              <div class="mb-3">
                <label class="form-label">Tên phòng khám</label>
                <input type="text" class="form-control" v-model="settings.siteName" />
              </div>

              <div class="mb-3">
                <label class="form-label">Mô tả</label>
                <textarea
                  class="form-control"
                  v-model="settings.siteDescription"
                  rows="2"
                ></textarea>
              </div>

              <hr />

              <h5 class="mb-3">Thông tin liên hệ</h5>

              <div class="mb-3">
                <label class="form-label">Số điện thoại</label>
                <input type="text" class="form-control" v-model="settings.contactPhone" />
              </div>

              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" v-model="settings.contactEmail" />
              </div>

              <div class="mb-3">
                <label class="form-label">Địa chỉ</label>
                <input type="text" class="form-control" v-model="settings.address" />
              </div>

              <hr />

              <h5 class="mb-3">Cài đặt làm việc</h5>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Giờ bắt đầu</label>
                  <input type="time" class="form-control" v-model="settings.workingStart" />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Giờ kết thúc</label>
                  <input type="time" class="form-control" v-model="settings.workingEnd" />
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Phí tư vấn mặc định</label>
                <input
                  type="number"
                  class="form-control"
                  v-model="settings.defaultConsultationFee"
                />
              </div>

              <div class="alert alert-info mt-3">
                <i class="bi bi-info-circle"></i>
                Các thông tin này sẽ hiển thị trên trang chủ và footer của website.
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Preview</h5>
            </div>
            <div class="card-body">
              <div class="preview-item">
                <label class="text-muted">Tên phòng khám</label>
                <p class="fw-bold">{{ settings.siteName || 'Chưa cập nhật' }}</p>
              </div>
              <div class="preview-item">
                <label class="text-muted">Số điện thoại</label>
                <p>{{ settings.contactPhone || 'Chưa cập nhật' }}</p>
              </div>
              <div class="preview-item">
                <label class="text-muted">Email</label>
                <p>{{ settings.contactEmail || 'Chưa cập nhật' }}</p>
              </div>
              <div class="preview-item">
                <label class="text-muted">Địa chỉ</label>
                <p>{{ settings.address || 'Chưa cập nhật' }}</p>
              </div>
              <div class="preview-item">
                <label class="text-muted">Giờ làm việc</label>
                <p>{{ settings.workingStart || '08:00' }} - {{ settings.workingEnd || '20:00' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { systemSettingsApi } from '@/api/admin/systemSettings'
import { useToast } from '@erag/vue-toastification'

const toast = useToast()
const saving = ref(false)

const settings = reactive({
  siteName: '',
  siteDescription: '',
  contactPhone: '',
  contactEmail: '',
  address: '',
  workingStart: '08:00',
  workingEnd: '20:00',
  defaultConsultationFee: 50000,
})

const fetchSettings = async () => {
  try {
    const response = await systemSettingsApi.getGroup('General')
    if (response.data.success) {
      const data = response.data.data
      settings.siteName = data.find((s) => s.settingKey === 'SiteName')?.settingValue || ''
      settings.siteDescription =
        data.find((s) => s.settingKey === 'SiteDescription')?.settingValue || ''
      settings.contactPhone = data.find((s) => s.settingKey === 'ContactPhone')?.settingValue || ''
      settings.contactEmail = data.find((s) => s.settingKey === 'ContactEmail')?.settingValue || ''
      settings.address = data.find((s) => s.settingKey === 'Address')?.settingValue || ''

      const workingHours = data.find((s) => s.settingKey === 'WorkingHours')?.settingValue
      if (workingHours) {
        try {
          const parsed = JSON.parse(workingHours)
          settings.workingStart = parsed.start || '08:00'
          settings.workingEnd = parsed.end || '20:00'
        } catch {}
      }

      const fee = data.find((s) => s.settingKey === 'DefaultConsultationFee')?.settingValue
      if (fee) {
        settings.defaultConsultationFee = parseInt(fee) || 50000
      }
    }
  } catch (error) {
    toast.error('Không thể tải cài đặt')
  }
}

const saveSettings = async () => {
  saving.value = true
  try {
    const data = [
      { key: 'SiteName', value: settings.siteName },
      { key: 'SiteDescription', value: settings.siteDescription },
      { key: 'ContactPhone', value: settings.contactPhone },
      { key: 'ContactEmail', value: settings.contactEmail },
      { key: 'Address', value: settings.address },
      {
        key: 'WorkingHours',
        value: JSON.stringify({ start: settings.workingStart, end: settings.workingEnd }),
      },
      { key: 'DefaultConsultationFee', value: settings.defaultConsultationFee.toString() },
    ]

    const response = await systemSettingsApi.updateGroup(data)
    if (response.data.success) {
      toast.success('Lưu cài đặt thành công!')
    }
  } catch (error) {
    toast.error('Lưu cài đặt thất bại')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchSettings()
})
</script>

<style scoped>
.general-settings {
  padding: 20px;
}

.preview-item {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.preview-item:last-child {
  border-bottom: none;
}

.preview-item label {
  display: block;
  font-size: 0.8rem;
  margin-bottom: 2px;
}

.preview-item p {
  margin: 0;
  font-weight: 500;
}
</style>
