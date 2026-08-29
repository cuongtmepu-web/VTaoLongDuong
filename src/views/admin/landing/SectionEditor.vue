<template>
  <AdminLayout>
    <div class="section-editor">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Chỉnh sửa: {{ sectionName }}</h2>
        <div>
          <button class="btn btn-success me-2" @click="saveSection" :disabled="saving">
            <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
            <i class="bi bi-save"></i> Lưu
          </button>
          <router-link to="/admin/landing" class="btn btn-secondary">
            <i class="bi bi-arrow-left"></i> Quay lại
          </router-link>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
          </div>

          <div v-else>
            <div class="alert alert-info">
              <i class="bi bi-info-circle"></i>
              Chỉnh sửa nội dung section. Dữ liệu được lưu dưới dạng JSON.
            </div>

            <div class="mb-3">
              <label class="form-label">Nội dung (JSON)</label>
              <textarea
                class="form-control"
                v-model="contentJson"
                rows="15"
                style="font-family: monospace; font-size: 14px"
              ></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">Xem trước</label>
              <div class="preview-box p-3 border rounded bg-light">
                <pre>{{ contentJson }}</pre>
              </div>
            </div>

            <div class="d-flex gap-2">
              <button class="btn btn-primary" @click="formatJson" :disabled="!contentJson">
                <i class="bi bi-braces"></i> Format JSON
              </button>
              <button
                class="btn btn-outline-danger"
                @click="resetSection"
                :disabled="!originalContent"
              >
                <i class="bi bi-arrow-counterclockwise"></i> Reset
              </button>
            </div>

            <div v-if="jsonError" class="alert alert-danger mt-3">
              <i class="bi bi-exclamation-triangle"></i>
              {{ jsonError }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { landingApi } from '@/api/admin/adminLanding'
import { useToast } from '@erag/vue-toastification'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const loading = ref(false)
const saving = ref(false)
const sectionName = ref('')
const contentJson = ref('')
const originalContent = ref('')
const jsonError = ref('')

const sectionKey = computed(() => route.params.sectionKey as string)

const formatJson = () => {
  try {
    const parsed = JSON.parse(contentJson.value)
    contentJson.value = JSON.stringify(parsed, null, 2)
    jsonError.value = ''
  } catch (error: any) {
    jsonError.value = 'JSON không hợp lệ: ' + error.message
  }
}

const fetchSection = async () => {
  loading.value = true
  try {
    const response = await landingApi.getSection(sectionKey.value)
    if (response.data.success) {
      const data = response.data.data
      sectionName.value = data.sectionName
      // Pretty format
      const parsed = JSON.parse(data.contentJson)
      contentJson.value = JSON.stringify(parsed, null, 2)
      originalContent.value = contentJson.value
    }
  } catch (error) {
    toast.error('Không thể tải nội dung section')
  } finally {
    loading.value = false
  }
}

const saveSection = async () => {
  try {
    // Validate JSON
    const parsed = JSON.parse(contentJson.value)
    jsonError.value = ''

    saving.value = true
    const response = await landingApi.update(sectionKey.value, {
      contentJson: JSON.stringify(parsed),
    })

    if (response.data.success) {
      toast.success('Lưu nội dung thành công!')
      originalContent.value = contentJson.value
    }
  } catch (error: any) {
    jsonError.value = 'JSON không hợp lệ: ' + error.message
    toast.error('Lưu thất bại')
  } finally {
    saving.value = false
  }
}

const resetSection = () => {
  if (confirm('Bạn có chắc muốn reset về trạng thái ban đầu?')) {
    contentJson.value = originalContent.value
    jsonError.value = ''
    toast.info('Đã reset')
  }
}

onMounted(() => {
  if (sectionKey.value) {
    fetchSection()
  } else {
    router.push('/admin/landing')
  }
})
</script>

<style scoped>
.section-editor {
  padding: 20px;
}

.preview-box {
  max-height: 300px;
  overflow: auto;
}

.preview-box pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
