<template>
  <DefaultLayout>
    <div class="blog-list-page py-5">
      <div class="container">
        <h2 class="text-center mb-4">Bài thuốc & Kiến thức sức khỏe</h2>

        <!-- Search & Filter -->
        <div class="row g-3 mb-4">
          <div class="col-md-4">
            <input
              type="text"
              class="form-control"
              v-model="search"
              placeholder="Tìm kiếm bài viết..."
              @input="onSearch"
            />
          </div>
          <div class="col-md-3">
            <select class="form-select" v-model="categoryFilter" @change="onSearch">
              <option value="">Tất cả danh mục</option>
              <option v-for="cat in categories" :key="cat.categoryId" :value="cat.categoryId">
                {{ cat.categoryName }}
              </option>
            </select>
          </div>
          <div class="col-md-2">
            <button class="btn btn-primary w-100" @click="fetchPosts">
              <i class="bi bi-search"></i> Tìm
            </button>
          </div>
        </div>

        <!-- Posts -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>

        <div v-else-if="posts.length === 0" class="text-center py-5">
          <i class="bi bi-newspaper display-1 text-muted"></i>
          <h4 class="mt-3">Chưa có bài viết</h4>
          <p class="text-muted">Hiện tại chưa có bài viết nào trong danh mục này</p>
        </div>

        <div v-else>
          <div class="row g-4">
            <div class="col-md-4" v-for="post in posts" :key="post.postId">
              <div class="blog-card">
                <div class="blog-image">
                  <img
                    :src="post.featuredImageUrl || '/images/blog-default.jpg'"
                    :alt="post.title"
                    class="img-fluid"
                  />
                  <span class="category-badge">{{ post.categoryName }}</span>
                </div>
                <div class="blog-content">
                  <h5>{{ post.title }}</h5>
                  <p class="text-muted small">
                    {{ truncateSummary(post.summary || post.content) }}
                  </p>
                  <div class="blog-meta d-flex justify-content-between align-items-center">
                    <span class="text-muted small">
                      <i class="bi bi-person"></i> {{ post.authorName }}
                    </span>
                    <span class="text-muted small">
                      <i class="bi bi-calendar3"></i> {{ formatDate(post.createdAt) }}
                    </span>
                  </div>
                  <router-link
                    :to="`/bai-thuoc/${post.slug}`"
                    class="btn btn-outline-primary btn-sm mt-3"
                  >
                    Đọc tiếp <i class="bi bi-arrow-right"></i>
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div class="d-flex justify-content-center mt-4">
            <nav>
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: pagination.currentPage === 1 }">
                  <a
                    class="page-link"
                    href="#"
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
                  <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ disabled: pagination.currentPage === totalPages }">
                  <a
                    class="page-link"
                    href="#"
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
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useBlogStore } from '@/api/stores/blog'
import dayjs from 'dayjs'
import { debounce } from 'lodash'

const blogStore = useBlogStore()
const loading = ref(false)
const search = ref('')
const categoryFilter = ref('')

const posts = computed(() => blogStore.posts)
const categories = computed(() => blogStore.categories)
const pagination = computed(() => blogStore.pagination)

const totalPages = computed(() => {
  return Math.ceil(pagination.value.totalCount / pagination.value.pageSize)
})

const truncateSummary = (text: string, maxLength: number = 120) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const formatDate = (date: string) => {
  return dayjs(date).format('DD/MM/YYYY')
}

const fetchPosts = async () => {
  loading.value = true
  const params: any = {
    page: pagination.value.currentPage,
    pageSize: pagination.value.pageSize,
  }

  if (search.value) params.search = search.value
  if (categoryFilter.value) params.categoryId = categoryFilter.value

  await blogStore.fetchPosts(params)
  loading.value = false
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

onMounted(async () => {
  await blogStore.fetchCategories()
  await fetchPosts()
})
</script>

<style scoped>
.blog-list-page {
  background: #f8f9fa;
  min-height: 100vh;
}

.blog-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s;
  height: 100%;
}

.blog-card:hover {
  transform: translateY(-5px);
}

.blog-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.blog-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #ffc107;
  color: #333;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: bold;
}

.blog-content {
  padding: 20px;
}

.blog-content h5 {
  margin-bottom: 10px;
  font-weight: 600;
}

.blog-content p {
  margin-bottom: 15px;
}

.blog-meta {
  font-size: 0.85rem;
}
</style>
