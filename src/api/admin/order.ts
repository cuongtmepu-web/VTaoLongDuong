import api from '../axios'
import { type Order } from '@/api/types/payment'
import { type ApiResponse, type PaginatedResponse } from '@/api/types/common'

export const orderApi = {
  getAll: (params?: { page?: number; pageSize?: number; search?: string; status?: string }) =>
    api.get<ApiResponse<PaginatedResponse<Order>>>('/admin/order', { params }),

  getById: (id: number) => api.get<ApiResponse<Order>>(`/admin/order/${id}`),

  updateStatus: (id: number, data: { paymentStatus?: string; orderStatus?: string }) =>
    api.put<ApiResponse<null>>(`/admin/order/${id}/status`, data),
}
