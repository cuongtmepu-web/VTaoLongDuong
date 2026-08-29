<template>
  <div class="image-uploader">
    <div class="drop-zone" @dragover.prevent @drop.prevent="handleDrop" @click="triggerUpload">
      <input
        type="file"
        ref="fileInput"
        accept="image/*"
        @change="handleFileSelect"
        style="display: none"
      />
      <div v-if="!uploading && !imageUrl">
        <i class="bi bi-cloud-upload display-4"></i>
        <p class="mb-0">Kéo thả ảnh vào đây hoặc click để chọn</p>
        <small class="text-muted">Hỗ trợ: JPG, PNG, GIF (max 5MB)</small>
      </div>
      <div v-if="uploading" class="text-center">
        <div class="spinner-border text-primary"></div>
        <p class="mt-2">Đang tải lên...</p>
      </div>
      <div v-if="imageUrl && !uploading" class="preview-container">
        <img :src="imageUrl" :alt="alt" class="preview-image" />
        <div class="preview-actions">
          <button class="btn btn-sm btn-danger" @click.stop="removeImage">
            <i class="bi bi-x"></i> Xóa
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { landingApi } from '@/api/admin/adminLanding'
import { useToast } from '@erag/vue-toastification'

const props = defineProps<{
  modelValue?: string
  alt?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'uploaded', url: string): void
}>()

const toast = useToast()
const fileInput = ref<HTMLInputElement>()
const uploading = ref(false)
const imageUrl = ref(props.modelValue || '')

const triggerUpload = () => {
  if (!uploading.value) {
    fileInput.value?.click()
  }
}

// Sửa tại đây: Kiểm tra file tồn tại trước khi gọi uploadFile
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    uploadFile(file)
  }
}

// Sửa tại đây: Kiểm tra file tồn tại trước khi gọi uploadFile
const handleDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files?.[0]
  if (file) {
    uploadFile(file)
  }
}

const uploadFile = async (file: File) => {
  if (!file.type.startsWith('image/')) {
    toast.error('Vui lòng chọn file ảnh')
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    toast.error('Kích thước ảnh không được vượt quá 5MB')
    return
  }

  uploading.value = true
  try {
    const response = await landingApi.uploadImage(file)
    if (response.data.success) {
      imageUrl.value = response.data.data.url
      emit('update:modelValue', imageUrl.value)
      emit('uploaded', imageUrl.value)
      toast.success('Tải ảnh lên thành công')
    }
  } catch (error) {
    toast.error('Tải ảnh lên thất bại')
  } finally {
    uploading.value = false
  }
}

const removeImage = async () => {
  if (!imageUrl.value) return

  if (confirm('Bạn có chắc muốn xóa ảnh này?')) {
    try {
      await landingApi.deleteImage(imageUrl.value)
      imageUrl.value = ''
      emit('update:modelValue', '')
      toast.success('Xóa ảnh thành công')
    } catch (error) {
      toast.error('Xóa ảnh thất bại')
    }
  }
}
</script>

<style scoped>
.drop-zone {
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}

.drop-zone:hover {
  border-color: #2c3e50;
  background: #f1f3f5;
}

.preview-container {
  position: relative;
  width: 100%;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
}

.preview-actions {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
