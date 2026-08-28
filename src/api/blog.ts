import api from './axios'
import { type BlogCategory, type BlogPost, type BlogComment } from './types/blog'
import { type ApiResponse, type PaginatedResponse } from './types/common'

export const blogApi = {
  getCategories: () => api.get<ApiResponse<BlogCategory[]>>('/blog/categories'),

  getPosts: (params?: { categoryId?: number; page?: number; pageSize?: number; search?: string }) =>
    api.get<ApiResponse<PaginatedResponse<BlogPost>>>('/blog/posts', { params }),

  getPostBySlug: (slug: string) => api.get<ApiResponse<BlogPost>>(`/blog/posts/${slug}`),

  getFeaturedPosts: (count: number = 3) =>
    api.get<ApiResponse<BlogPost[]>>(`/blog/posts/featured?count=${count}`),

  likePost: (postId: number) =>
    api.post<ApiResponse<{ likes: number }>>(`/blog/posts/${postId}/like`),

  addComment: (postId: number, content: string, parentId?: number) =>
    api.post<ApiResponse<BlogComment>>(`/blog/posts/${postId}/comments`, { content, parentId }),
}
