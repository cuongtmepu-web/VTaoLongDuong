import { defineStore } from 'pinia'
import { blogApi } from '@/api/blog'
import { type BlogPost, type BlogCategory, type BlogComment } from '@/api/types/blog'
import { type PaginatedResponse } from '@/api/types/common'
import { useToast } from '@erag/vue-toastification'

const toast = useToast()

interface BlogState {
  categories: BlogCategory[]
  posts: BlogPost[]
  currentPost: BlogPost | null
  pagination: {
    currentPage: number
    pageSize: number
    totalCount: number
    totalPages: number
  }
  loading: boolean
}

export const useBlogStore = defineStore('blog', {
  state: (): BlogState => ({
    categories: [],
    posts: [],
    currentPost: null,
    pagination: {
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
    },
    loading: false,
  }),

  getters: {
    featuredPosts: (state) => state.posts.filter((p) => p.isFeatured),
  },

  actions: {
    async fetchCategories(): Promise<void> {
      try {
        const response = await blogApi.getCategories()
        if (response.data.success) {
          this.categories = response.data.data
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    },

    async fetchPosts(params?: {
      categoryId?: number
      page?: number
      pageSize?: number
      search?: string
    }): Promise<void> {
      this.loading = true
      try {
        const response = await blogApi.getPosts(params)
        if (response.data.success) {
          this.posts = response.data.data.data
          this.pagination = response.data.data.pagination
        }
      } catch (error: any) {
        toast.error('Không thể tải bài viết')
      } finally {
        this.loading = false
      }
    },

    async fetchPostBySlug(slug: string): Promise<void> {
      this.loading = true
      try {
        const response = await blogApi.getPostBySlug(slug)
        if (response.data.success) {
          this.currentPost = response.data.data
        }
      } catch (error: any) {
        toast.error('Không thể tải bài viết')
      } finally {
        this.loading = false
      }
    },

    async likePost(postId: number): Promise<boolean> {
      try {
        const response = await blogApi.likePost(postId)
        if (response.data.success) {
          if (this.currentPost && this.currentPost.postId === postId) {
            this.currentPost.likes = response.data.data.likes
          }
          return true
        }
        return false
      } catch (error: any) {
        toast.error('Không thể thích bài viết')
        return false
      }
    },
  },
})
