<template>
  <AdminLayout>
    <div class="landing-editor">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Quản lý trang chủ</h2>
      </div>

      <div class="row g-4">
        <div class="col-md-4" v-for="section in sections" :key="section.sectionKey">
          <div class="card">
            <div class="card-body text-center">
              <div class="section-icon mb-3">
                <i :class="getSectionIcon(section.sectionKey)"></i>
              </div>
              <h5>{{ section.sectionName }}</h5>
              <p class="text-muted small">Cập nhật: {{ formatDate(section.updatedAt) }}</p>
              <router-link
                :to="`/admin/landing/section/${section.sectionKey}`"
                class="btn btn-primary btn-sm"
              >
                <i class="bi bi-pencil"></i> Chỉnh sửa
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="alert alert-info mt-4">
        <i class="bi bi-info-circle"></i>
        <strong>Hướng dẫn:</strong> Click vào nút "Chỉnh sửa" để thay đổi nội dung của từng section
        trên trang chủ. Mỗi section có thể chứa văn bản, hình ảnh và các cấu hình khác.
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { landingApi } from '@/api/admin/adminLanding'
import type { LandingSection } from '@/api/admin/adminLanding'
import dayjs from 'dayjs'

const sections = ref<LandingSection[]>([])

const getSectionIcon = (key: string) => {
  const icons: Record<string, string> = {
    hero: 'bi bi-house-heart',
    about: 'bi bi-info-circle',
    services: 'bi bi-grid',
    doctors: 'bi bi-person-heart',
    testimonials: 'bi bi-chat-quote',
    blog: 'bi bi-newspaper',
    contact: 'bi bi-envelope',
    footer: 'bi bi-layout-text-window',
  }
  return icons[key] || 'bi bi-pencil-square'
}

const formatDate = (date: string) => {
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}

const fetchSections = async () => {
  try {
    const response = await landingApi.getAll()
    if (response.data.success) {
      sections.value = response.data.data
    }
  } catch (error) {
    console.error('Failed to fetch sections:', error)
  }
}

onMounted(() => {
  fetchSections()
})
</script>

<style scoped>
.landing-editor {
  padding: 20px;
}

.section-icon {
  font-size: 3rem;
  color: #2c3e50;
}

.card {
  transition: transform 0.3s;
}

.card:hover {
  transform: translateY(-5px);
}
</style>
