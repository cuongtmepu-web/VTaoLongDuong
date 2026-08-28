import api from '../axios'
import { type Appointment, type AppointmentStatus } from '@/api/types/appointment'
import { type ApiResponse, type PaginatedResponse } from '@/api/types/common'

export const adminAppointmentApi = {
  getAll: (params?: {
    page?: number
    pageSize?: number
    status?: string
    date?: string
    search?: string
  }) => api.get<ApiResponse<PaginatedResponse<Appointment>>>('/admin/appointment', { params }),

  getById: (id: number) => api.get<ApiResponse<Appointment>>(`/admin/appointment/${id}`),

  updateStatus: (id: number, data: { status: AppointmentStatus; notes?: string }) =>
    api.put<ApiResponse<null>>(`/admin/appointment/${id}/status`, data),

  getCalendar: (params?: { month?: number; year?: number }) =>
    api.get<ApiResponse<any[]>>('/admin/appointment/calendar', { params }),

  getStats: () => api.get<ApiResponse<any>>('/admin/appointment/stats'),
}
