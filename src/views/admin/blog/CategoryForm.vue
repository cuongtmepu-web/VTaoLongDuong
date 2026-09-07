<template>
  <AdminLayout>
    <div class="category-form">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">{{ isEdit ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới' }}</h2>
        <router-link to="/admin/blog/categories" class="btn btn-secondary">
          <i class="bi bi-arrow-left"></i> Quay lại
        </router-link>
      </div>

      <div class="card">
        <div class="card-body">
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label class="form-label">Tên danh mục *</label>
              <input type="text" class="form-control" v-model="form.categoryName" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Slug *</label>
              <input type="text" class="form-control" v-model="form.slug" required />
              <small class="text-muted">Ví dụ: bai-thuoc-dong-y</small>
            </div>

            <div class="mb-3">
              <label class="form-label">Mô tả</label>
              <textarea class="form-control" v-model="form.description" rows="3"></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">Danh mục cha</label>
              <BaseSelect
                v-model="form.parentId"
                :options="[
                  { value: null, label: 'Không có' },
                  ...parentCategories.map((cat) => ({
                    value: cat.categoryId,
                    label: cat.categoryName,
                  })),
                ]"
              />
            </div>

            <div class="mb-3">
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="form.isActive"
                  id="activeSwitch"
                />
                <label class="form-check-label" for="activeSwitch">Hiển thị</label>
              </div>
            </div>

            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-primary" :disabled="submitting">
                <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                {{ isEdit ? 'Cập nhật' : 'Thêm mới' }}
              </button>
              <router-link to="/admin/blog/categories" class="btn btn-secondary">Hủy</router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import { adminBlogApi } from '@/api/admin/adminBlog'
import type { BlogCategory } from '@/api/types/blog'
import { useToast } from '@erag/vue-toastification'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const submitting = ref(false)
const allCategories = ref<BlogCategory[]>([])

const isEdit = computed(() => !!route.params.id)

const form = reactive({
  categoryName: '',
  slug: '',
  description: '',
  parentId: null as number | null,
  isActive: true,
})

const parentCategories = computed(() => {
  if (isEdit.value) {
    const id = parseInt(route.params.id as string)
    return allCategories.value.filter((c) => c.categoryId !== id)
  }
  return allCategories.value
})

const fetchCategories = async () => {
  try {
    const response = await adminBlogApi.getCategories()
    if (response.data.success) {
      allCategories.value = response.data.data
    }
  } catch (error) {
    toast.error('Không thể tải danh sách danh mục')
  }
}

const fetchCategory = async () => {
  const id = route.params.id as string
  if (!id) return

  try {
    const response = await adminBlogApi.getCategories()
    if (response.data.success) {
      const data = response.data.data.find((c) => c.categoryId === parseInt(id))
      if (data) {
        Object.assign(form, {
          categoryName: data.categoryName,
          slug: data.slug,
          description: data.description || '',
          parentId: data.parentId || null,
          isActive: data.isActive,
        })
      }
    }
  } catch (error) {
    toast.error('Không thể tải thông tin danh mục')
    router.push('/admin/blog/categories')
  }
}

const handleSubmit = async () => {
  if (!form.categoryName || !form.slug) {
    toast.warning('Vui lòng nhập đầy đủ thông tin')
    return
  }

  submitting.value = true
  try {
    const data = {
      categoryName: form.categoryName,
      slug: form.slug,
      description: form.description,
      parentId: form.parentId || undefined,
    }

    let response
    if (isEdit.value) {
      response = await adminBlogApi.updateCategory(parseInt(route.params.id as string), data)
    } else {
      response = await adminBlogApi.createCategory(data)
    }

    if (response.data.success) {
      toast.success(isEdit.value ? 'Cập nhật danh mục thành công' : 'Thêm danh mục thành công')
      router.push('/admin/blog/categories')
    }
  } catch (error) {
    toast.error('Lưu thông tin thất bại')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchCategories()
  if (isEdit.value) {
    fetchCategory()
  }
})
</script>

<style scoped>
.category-form {
  padding: 20px;
}
</style>
