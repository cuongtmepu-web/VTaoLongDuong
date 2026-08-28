import api from '../axios'
import { type BlogCategory, type BlogPost } from '@/api/types/blog'
import { type ApiResponse, type PaginatedResponse } from '@/api/types/common'

export const adminBlogApi = {
  // Categories
  getCategories: () => api.get<ApiResponse<BlogCategory[]>>('/admin/blog/categories'),

  createCategory: (data: {
    categoryName: string
    slug: string
    description?: string
    parentId?: number
  }) => api.post<ApiResponse<BlogCategory>>('/admin/blog/categories', data),

  updateCategory: (
    id: number,
    data: { categoryName?: string; description?: string; isActive?: boolean },
  ) => api.put<ApiResponse<null>>(`/admin/blog/categories/${id}`, data),

  deleteCategory: (id: number) => api.delete<ApiResponse<null>>(`/admin/blog/categories/${id}`),

  // Posts
  getPosts: (params?: {
    page?: number
    pageSize?: number
    categoryId?: number
    isPublished?: boolean
    search?: string
  }) => api.get<ApiResponse<PaginatedResponse<BlogPost>>>('/admin/blog/posts', { params }),

  getPostById: (id: number) => api.get<ApiResponse<BlogPost>>(`/admin/blog/posts/${id}`),

  createPost: (data: any) => api.post<ApiResponse<BlogPost>>('/admin/blog/posts', data),

  updatePost: (id: number, data: any) =>
    api.put<ApiResponse<null>>(`/admin/blog/posts/${id}`, data),

  deletePost: (id: number) => api.delete<ApiResponse<null>>(`/admin/blog/posts/${id}`),

  publishPost: (id: number) => api.put<ApiResponse<null>>(`/admin/blog/posts/${id}/publish`, {}),
}
