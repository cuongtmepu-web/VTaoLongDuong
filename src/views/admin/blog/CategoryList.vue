<template>
  <AdminLayout>
    <div class="category-list">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Quản lý danh mục blog</h2>
        <router-link to="/admin/blog/categories/create" class="btn btn-primary">
          <i class="bi bi-plus-circle"></i> Thêm danh mục
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
                    <th>Tên danh mục</th>
                    <th>Slug</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="category in categories" :key="category.categoryId">
                    <td>{{ category.categoryId }}</td>
                    <td>{{ category.categoryName }}</td>
                    <td>{{ category.slug }}</td>
                    <td>
                      <span
                        :class="category.isActive ? 'bg-success' : 'bg-secondary'"
                        class="badge"
                      >
                        {{ category.isActive ? 'Hiển thị' : 'Ẩn' }}
                      </span>
                    </td>
                    <td>
                      <div class="btn-group">
                        <router-link
                          :to="`/admin/blog/categories/${category.categoryId}/edit`"
                          class="btn btn-sm btn-outline-primary"
                        >
                          <i class="bi bi-pencil"></i>
                        </router-link>
                        <button
                          class="btn btn-sm btn-outline-danger"
                          @click="deleteCategory(category)"
                        >
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
import { adminBlogApi } from '@/api/admin/adminBlog'
import type { BlogCategory } from '@/api/types/blog'
import { useToast } from '@erag/vue-toastification'

const toast = useToast()
const loading = ref(false)
const categories = ref<BlogCategory[]>([])

const fetchCategories = async () => {
  loading.value = true
  try {
    const response = await adminBlogApi.getCategories()
    if (response.data.success) {
      categories.value = response.data.data
    }
  } catch (error) {
    toast.error('Không thể tải danh sách danh mục')
  } finally {
    loading.value = false
  }
}

const deleteCategory = async (category: BlogCategory) => {
  if (!confirm(`Bạn có chắc muốn xóa danh mục ${category.categoryName}?`)) return

  try {
    const response = await adminBlogApi.deleteCategory(category.categoryId)
    if (response.data.success) {
      toast.success('Xóa danh mục thành công')
      await fetchCategories()
    }
  } catch (error) {
    toast.error('Xóa thất bại')
  }
}

onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
.category-list {
  padding: 20px;
}
</style>
