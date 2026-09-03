<template>
  <section class="blog-section py-5">
    <div class="mist-layer"></div>
    <div class="container">
      <div class="section-header">
        <span class="eyebrow-tag">Tri thức Đông y</span>
        <h2 class="section-title mb-0">
          {{ sectionData.title || 'Bài viết mới nhất' }}
        </h2>
        <div class="section-divider">
          <span class="line"></span>
          <svg class="taiji-icon" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" stroke-width="3" />
            <path
              d="M50,3 A23.5,23.5 0 0,1 50,50 A23.5,23.5 0 0,0 50,97 A47,47 0 0,1 50,3 Z"
              fill="currentColor"
            />
            <circle cx="50" cy="26.5" r="7" fill="var(--surface)" />
            <circle cx="50" cy="73.5" r="7" fill="currentColor" />
          </svg>
          <span class="line right"></span>
        </div>
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
  position: relative;
  padding: 5.5rem 0;
  background: linear-gradient(180deg, var(--surface) 0%, var(--soft-sand) 100%);
  border: none;
  overflow: hidden;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}
.eyebrow-tag {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold);
}
.section-header .section-title {
  display: inline-block;
}
.section-header .section-title::after {
  display: none;
}
.section-header .section-divider {
  margin-top: 1rem;
}

.blog-card {
  background: var(--surface);
  border-radius: 22px;
  overflow: hidden;
  border: 1px solid var(--surface-border);
  box-shadow: 0 12px 24px rgba(28, 38, 32, 0.04);
  transition: all 0.35s var(--ease);
  height: 100%;
  display: flex;
  flex-direction: column;
}
.blog-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 32px rgba(28, 38, 32, 0.1);
  border-color: var(--gold-light);
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
  transition: transform 0.4s var(--ease);
}
.blog-card:hover .blog-image img {
  transform: scale(1.06);
}
.category-badge {
  position: absolute;
  top: 0.9rem;
  left: 0.9rem;
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  background: rgba(28, 38, 32, 0.75);
  backdrop-filter: blur(4px);
  color: var(--gold-light);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.03em;
}
.blog-content {
  padding: 1.5rem 1.3rem 1.4rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.blog-copy h5 {
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text);
}
.blog-copy p {
  color: var(--text-soft);
  font-size: 0.92rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}
.blog-meta {
  font-size: 0.8rem;
  color: var(--text-muted);
  border-top: 1px solid var(--surface-border);
  padding-top: 0.8rem;
  margin-top: auto;
}

@media (max-width: 576px) {
  .blog-section {
    padding: 4rem 0;
  }
}
</style>
