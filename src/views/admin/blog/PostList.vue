<template>
  <AdminLayout>
    <div class="post-list">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Quản lý bài viết blog</h2>
        <router-link to="/admin/blog/posts/create" class="btn btn-primary">
          <i class="bi bi-plus-circle"></i> Viết bài mới
        </router-link>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="d-flex gap-2 mb-3">
            <input
              type="text"
              class="form-control"
              v-model="search"
              placeholder="Tìm kiếm bài viết..."
              style="width: 250px"
              @input="onSearch"
            />
            <BaseSelect
              v-model="categoryFilter"
              :options="[
                { value: '', label: 'Tất cả danh mục' },
                ...categories.map((cat) => ({
                  value: String(cat.categoryId),
                  label: cat.categoryName,
                })),
              ]"
              style="width: 150px"
              @update:model-value="onSearch"
            />
            <BaseSelect
              v-model="statusFilter"
              :options="[
                { value: '', label: 'Tất cả trạng thái' },
                { value: 'true', label: 'Đã đăng' },
                { value: 'false', label: 'Bản nháp' },
              ]"
              style="width: 150px"
              @update:model-value="onSearch"
            />
            <button class="btn btn-primary" @click="fetchPosts">
              <i class="bi bi-search"></i> Tìm
            </button>
          </div>

          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
          </div>
          <div v-else>
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tiêu đề</th>
                    <th>Danh mục</th>
                    <th>Tác giả</th>
                    <th>Lượt xem</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="post in posts" :key="post.postId">
                    <td>{{ post.postId }}</td>
                    <td>
                      <div class="fw-bold">{{ post.title }}</div>
                      <small class="text-muted">{{ post.slug }}</small>
                    </td>
                    <td>{{ post.categoryName }}</td>
                    <td>{{ post.authorName }}</td>
                    <td>{{ post.views }}</td>
                    <td>
                      <span :class="post.isPublished ? 'bg-success' : 'bg-secondary'" class="badge">
                        {{ post.isPublished ? 'Đã đăng' : 'Bản nháp' }}
                      </span>
                      <span v-if="post.isFeatured" class="badge bg-warning ms-1">Nổi bật</span>
                    </td>
                    <td>
                      <div class="btn-group">
                        <router-link
                          :to="`/admin/blog/posts/${post.postId}/edit`"
                          class="btn btn-sm btn-outline-primary"
                        >
                          <i class="bi bi-pencil"></i>
                        </router-link>
                        <button class="btn btn-sm btn-outline-success" @click="togglePublish(post)">
                          <i :class="post.isPublished ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" @click="deletePost(post)">
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div class="d-flex justify-content-between align-items-center mt-3">
              <span class="text-muted">
                Hiển thị {{ (pagination.currentPage - 1) * pagination.pageSize + 1 }} -
                {{ Math.min(pagination.currentPage * pagination.pageSize, pagination.totalCount) }}
                / {{ pagination.totalCount }} bài viết
              </span>
              <nav>
                <ul class="pagination mb-0">
                  <li class="page-item" :class="{ disabled: pagination.currentPage === 1 }">
                    <a
                      class="page-link"
                      href="/"
                      @click.prevent="changePage(pagination.currentPage - 1)"
                      >Trước</a
                    >
                  </li>
                  <li
                    v-for="page in totalPages"
                    :key="page"
                    class="page-item"
                    :class="{ active: page === pagination.currentPage }"
                  >
                    <a class="page-link" href="/" @click.prevent="changePage(page)">{{ page }}</a>
                  </li>
                  <li
                    class="page-item"
                    :class="{ disabled: pagination.currentPage === totalPages }"
                  >
                    <a
                      class="page-link"
                      href="/"
                      @click.prevent="changePage(pagination.currentPage + 1)"
                      >Sau</a
                    >
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import { adminBlogApi } from '@/api/admin/adminBlog'
import type { BlogPost, BlogCategory } from '@/api/types/blog'
import { useToast } from '@erag/vue-toastification'
import { debounce } from 'lodash'

const toast = useToast()
const loading = ref(false)
const posts = ref<BlogPost[]>([])
const categories = ref<BlogCategory[]>([])
const search = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')
const pagination = ref({
  currentPage: 1,
  pageSize: 20,
  totalCount: 0,
})

const totalPages = computed(() => {
  return Math.ceil(pagination.value.totalCount / pagination.value.pageSize)
})

const fetchCategories = async () => {
  try {
    const response = await adminBlogApi.getCategories()
    if (response.data.success) {
      categories.value = response.data.data
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

const fetchPosts = async () => {
  loading.value = true
  try {
    const params: any = {
      page: pagination.value.currentPage,
      pageSize: pagination.value.pageSize,
    }
    if (search.value) params.search = search.value
    if (categoryFilter.value) params.categoryId = categoryFilter.value
    if (statusFilter.value !== '') params.isPublished = statusFilter.value === 'true'

    const response = await adminBlogApi.getPosts(params)
    if (response.data.success) {
      posts.value = response.data.data.data
      pagination.value.totalCount = response.data.data.pagination.totalCount
    }
  } catch (error) {
    toast.error('Không thể tải danh sách bài viết')
  } finally {
    loading.value = false
  }
}

const togglePublish = async (post: BlogPost) => {
  try {
    const response = await adminBlogApi.publishPost(post.postId)
    if (response.data.success) {
      toast.success(post.isPublished ? 'Đã ẩn bài viết' : 'Đã đăng bài viết')
      await fetchPosts()
    }
  } catch (error) {
    toast.error('Thao tác thất bại')
  }
}

const deletePost = async (post: BlogPost) => {
  if (!confirm(`Bạn có chắc muốn xóa bài viết "${post.title}"?`)) return

  try {
    const response = await adminBlogApi.deletePost(post.postId)
    if (response.data.success) {
      toast.success('Xóa bài viết thành công')
      await fetchPosts()
    }
  } catch (error) {
    toast.error('Xóa thất bại')
  }
}

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  pagination.value.currentPage = page
  fetchPosts()
}

const onSearch = debounce(() => {
  pagination.value.currentPage = 1
  fetchPosts()
}, 500)

onMounted(() => {
  fetchCategories()
  fetchPosts()
})
</script>

<style scoped>
.post-list {
  padding: 20px;
}
</style>
