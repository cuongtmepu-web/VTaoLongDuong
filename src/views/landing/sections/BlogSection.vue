<template>
  <section class="blog-section py-5">
    <div class="container">
      <h2 class="text-center section-title mb-5">
        {{ sectionData.title || 'Bài viết mới nhất' }}
      </h2>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
      </div>

      <div v-else-if="posts.length === 0" class="text-center py-5">
        <p class="text-muted">Chưa có bài viết nào</p>
      </div>

      <div v-else class="row g-4">
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
              <p class="text-muted small">{{ truncateSummary(post.summary || post.content) }}</p>
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
                Đọc tiếp
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-4">
        <router-link to="/bai-thuoc" class="btn btn-primary"> Xem tất cả bài viết </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLandingStore } from '@/api/stores/landing'
import { blogApi } from '@/api/blog'
import type { BlogPost } from '@/api/types/blog'
import dayjs from 'dayjs'

const landingStore = useLandingStore()
const sectionData = computed(() => landingStore.getSection('blog'))
const loading = ref(false)
const posts = ref<BlogPost[]>([])

const truncateSummary = (text: string, maxLength: number = 120) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const formatDate = (date: string) => {
  return dayjs(date).format('DD/MM/YYYY')
}

const fetchPosts = async () => {
  loading.value = true
  try {
    const response = await blogApi.getPosts({ page: 1, pageSize: 3 })
    if (response.data.success) {
      posts.value = response.data.data.data
    }
  } catch (error) {
    console.error('Failed to fetch blog posts:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPosts()
})
</script>

<style scoped>
.blog-section {
  background: white;
}

.section-title {
  font-size: 2.5rem;
  font-weight: bold;
}

.blog-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s;
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
