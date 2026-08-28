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
  }) => api.get<ApiResponse<PaginatedResponse<User>>>('/admin/user', { params }),

  getById: (id: number) => api.get<ApiResponse<User>>(`/admin/user/${id}`),

  updateUser: (id: number, data: UpdateUserRequest) =>
    api.put<ApiResponse<null>>(`/admin/user/${id}`, data),

  updateRole: (id: number, data: UpdateUserRoleRequest) =>
    api.put<ApiResponse<null>>(`/admin/user/${id}/role`, data),

  deleteUser: (id: number) => api.delete<ApiResponse<null>>(`/admin/user/${id}`),
}
