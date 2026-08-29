<template>
  <DefaultLayout>
    <div class="blog-detail-page py-5">
      <div class="container">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>

        <div v-else-if="post" class="blog-detail">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <router-link to="/">Trang chủ</router-link>
              </li>
              <li class="breadcrumb-item">
                <router-link to="/bai-thuoc">Bài thuốc</router-link>
              </li>
              <li class="breadcrumb-item active">{{ post.title }}</li>
            </ol>
          </nav>

          <div class="post-header">
            <h1 class="display-5 fw-bold mb-3">{{ post.title }}</h1>
            <div class="post-meta d-flex flex-wrap gap-3 text-muted">
              <span><i class="bi bi-person"></i> {{ post.authorName }}</span>
              <span><i class="bi bi-calendar3"></i> {{ formatDate(post.createdAt) }}</span>
              <span><i class="bi bi-eye"></i> {{ post.views }} lượt xem</span>
              <span><i class="bi bi-heart"></i> {{ post.likes }} lượt thích</span>
              <span><i class="bi bi-tag"></i> {{ post.categoryName }}</span>
            </div>
          </div>

          <div class="post-featured-image my-4" v-if="post.featuredImageUrl">
            <img :src="post.featuredImageUrl" :alt="post.title" class="img-fluid rounded shadow" />
          </div>

          <div class="post-content" v-html="post.content"></div>

          <div class="post-actions d-flex gap-3 mt-4">
            <button class="btn btn-outline-danger" @click="handleLike">
              <i class="bi bi-heart"></i> Thích ({{ post.likes }})
            </button>
            <button class="btn btn-outline-primary" @click="sharePost">
              <i class="bi bi-share"></i> Chia sẻ
            </button>
          </div>

          <hr />

          <!-- Comments -->
          <div class="comments-section">
            <h4 class="mb-3">Bình luận ({{ post.commentCount }})</h4>

            <div v-if="authStore.isAuthenticated" class="comment-form mb-4">
              <textarea
                class="form-control"
                v-model="commentContent"
                rows="3"
                placeholder="Viết bình luận của bạn..."
              ></textarea>
              <button class="btn btn-primary mt-2" @click="addComment" :disabled="!commentContent">
                Gửi bình luận
              </button>
            </div>
            <div v-else class="alert alert-info">
              <router-link to="/login">Đăng nhập</router-link> để bình luận
            </div>

            <div v-if="post.comments && post.comments.length > 0">
              <div v-for="comment in post.comments" :key="comment.commentId" class="comment-item">
                <div class="comment-author">
                  <strong>{{ comment.userName }}</strong>
                  <span class="text-muted small ms-2">{{ formatDate(comment.createdAt) }}</span>
                </div>
                <p class="comment-content">{{ comment.content }}</p>

                <!-- Replies -->
                <div v-if="comment.replies && comment.replies.length > 0" class="replies ms-4">
                  <div v-for="reply in comment.replies" :key="reply.commentId" class="comment-item">
                    <div class="comment-author">
                      <strong>{{ reply.userName }}</strong>
                      <span class="text-muted small ms-2">{{ formatDate(reply.createdAt) }}</span>
                    </div>
                    <p class="comment-content">{{ reply.content }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-5">
          <i class="bi bi-file-earmark-x display-1 text-muted"></i>
          <h4 class="mt-3">Không tìm thấy bài viết</h4>
          <router-link to="/bai-thuoc" class="btn btn-primary mt-3">
            Quay lại danh sách
          </router-link>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useBlogStore } from '@/api/stores/blog'
import { useAuthStore } from '@/api/stores/auth'
import { useToast } from '@erag/vue-toastification'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const blogStore = useBlogStore()
const authStore = useAuthStore()

const loading = ref(false)
const commentContent = ref('')

const post = ref(blogStore.currentPost)

const formatDate = (date: string) => {
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}

const fetchPost = async () => {
  const slug = route.params.slug as string
  if (!slug) return

  loading.value = true
  try {
    await blogStore.fetchPostBySlug(slug)
    post.value = blogStore.currentPost
  } catch (error) {
    toast.error('Không thể tải bài viết')
  } finally {
    loading.value = false
  }
}

const handleLike = async () => {
  if (!post.value) return
  const success = await blogStore.likePost(post.value.postId)
  if (success && post.value) {
    // Update UI
    post.value.likes = post.value.likes + 1
  }
}

const addComment = async () => {
  if (!post.value || !commentContent.value.trim()) return

  // TODO: Implement API call
  toast.success('Bình luận đã được gửi!')
  commentContent.value = ''
}

const sharePost = () => {
  if (navigator.share) {
    navigator.share({
      title: post.value?.title,
      text: post.value?.summary,
      url: window.location.href,
    })
  } else {
    // Copy to clipboard
    navigator.clipboard.writeText(window.location.href)
    toast.success('Đã sao chép link!')
  }
}

onMounted(() => {
  fetchPost()
})
</script>

<style scoped>
.blog-detail-page {
  padding: 6rem 0 3rem;
  background: var(--bg);
  min-height: 100vh;
}

.blog-detail {
  max-width: 820px;
  margin: 0 auto;
  padding: 0 2rem;
}

.blog-detail .post-header {
  margin-bottom: 2rem;
}
.blog-detail .post-header h1 {
  font-size: 2.8rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.2;
}
.blog-detail .post-meta {
  display: flex;
  gap: 1.5rem;
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-top: 0.5rem;
}
.blog-detail .post-content {
  font-size: 1.05rem;
  line-height: 1.9;
  color: var(--text-soft);
}
.blog-detail .post-content img {
  border-radius: var(--radius-md);
  margin: 1.5rem 0;
  box-shadow: var(--shadow-sm);
}

.comment-section {
  margin-top: 3rem;
  border-top: 1px solid var(--surface-border);
  padding-top: 2rem;
}
.comment-item {
  background: var(--surface);
  padding: 1rem 1.2rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--surface-border);
  margin-bottom: 0.8rem;
}
.comment-item .author {
  font-weight: 600;
}
.comment-item .date {
  color: var(--text-muted);
  font-size: 0.8rem;
  margin-left: 0.8rem;
}
.comment-item .content {
  color: var(--text-soft);
  margin-top: 0.2rem;
}
</style>
