import api from '../axios'
import { type Doctor } from '@/api/types/doctor'
import { type ApiResponse } from '@/api/types/common'

export const adminDoctorApi = {
  getAll: (params?: { isAvailable?: boolean }) =>
    api.get<ApiResponse<Doctor[]>>('/admin/doctor', { params }),

  getById: (id: number) => api.get<ApiResponse<Doctor>>(`/admin/doctor/${id}`),

  create: (data: any) => api.post<ApiResponse<Doctor>>('/admin/doctor', data),

  update: (id: number, data: any) => api.put<ApiResponse<null>>(`/admin/doctor/${id}`, data),

  delete: (id: number) => api.delete<ApiResponse<null>>(`/admin/doctor/${id}`),

  updateSchedule: (id: number, data: { scheduleJson: string }) =>
    api.put<ApiResponse<null>>(`/admin/doctor/${id}/schedule`, data),

  updateAvailability: (id: number, data: { isAvailable: boolean }) =>
    api.put<ApiResponse<null>>(`/admin/doctor/${id}/availability`, data),
}
