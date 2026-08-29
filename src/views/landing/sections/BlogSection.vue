<template>
  <section class="blog-section py-5">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title mb-0">
          {{ sectionData.title || 'Bài viết mới nhất' }}
        </h2>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
      </div>

      <div v-else-if="posts.length === 0" class="empty-state">
        <p>Chưa có bài viết nào</p>
      </div>

      <div v-else class="row g-4 blog-grid">
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
              <div class="blog-copy">
                <h5>{{ post.title }}</h5>
                <p class="text-muted small">{{ truncateSummary(post.summary || post.content) }}</p>
              </div>

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

      <div class="text-center mt-5">
        <router-link to="/bai-thuoc" class="btn btn-primary btn-lg"
          >Xem tất cả bài viết</router-link
        >
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
  padding: 5rem 0;
  background: var(--surface);
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}

.blog-card {
  background: var(--surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--surface-border);
  box-shadow: var(--shadow-sm);
  transition: all 0.35s var(--ease);
}
.blog-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-light);
}
.blog-card .thumb {
  height: 200px;
  overflow: hidden;
}
.blog-card .thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s var(--ease);
}
.blog-card:hover .thumb img {
  transform: scale(1.05);
}
.blog-card .body {
  padding: 1.4rem 1.2rem;
}
.blog-card .body h5 {
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.blog-card .body p {
  color: var(--text-soft);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}
.blog-card .meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--text-muted);
  border-top: 1px solid var(--surface-border);
  padding-top: 0.8rem;
}

@media (max-width: 992px) {
  .blog-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 576px) {
  .blog-grid {
    grid-template-columns: 1fr;
  }
}
</style>
