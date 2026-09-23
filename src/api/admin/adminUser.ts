import api from '../axios'
import { type User } from '@/api/types/auth'
import { type ApiResponse, type PaginatedResponse } from '@/api/types/common'

export interface UpdateUserRequest {
  fullName?: string
  phone?: string
  dateOfBirth?: string
  gender?: number
  address?: string
  isActive?: boolean
}

export interface CreateUserRequest {
  username: string
  password: string
  email: string
  fullName: string
  phone?: string
  role: 'Admin' | 'Doctor' | 'User'
  isActive: boolean
}

export interface UpdateUserRoleRequest {
  role: 'Admin' | 'Doctor' | 'User'
}

export const adminUserApi = {
  getUsers: (params?: {
    page?: number
    pageSize?: number
    search?: string
    role?: string
    isActive?: boolean
  }) => api.get<ApiResponse<PaginatedResponse<User>>>('/admin/AdminUser', { params }),

  getById: (id: number) => api.get<ApiResponse<User>>(`/admin/AdminUser/${id}`),

  // Backend endpoint for creating an account from the admin portal.
  createUser: (data: CreateUserRequest) => api.post<ApiResponse<User>>('/admin/AdminUser', data),

  updateUser: (id: number, data: UpdateUserRequest) =>
    api.put<ApiResponse<null>>(`/admin/AdminUser/${id}`, data),

  updateRole: (id: number, data: UpdateUserRoleRequest) =>
    api.put<ApiResponse<null>>(`/admin/AdminUser/${id}/role`, data),

  deleteUser: (id: number) => api.delete<ApiResponse<null>>(`/admin/AdminUser/${id}`),
}
