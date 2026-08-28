import api from './axios'
import { type Doctor, type DoctorListResponse } from './types/doctor'
import { type ApiResponse } from './types/common'

export const doctorApi = {
  getAll: () => api.get<ApiResponse<Doctor[]>>('/doctor'),

  getById: (id: number) => api.get<ApiResponse<Doctor>>(`/doctor/${id}`),

  getAvailableSlots: (doctorId: number, date: string) =>
    api.get<ApiResponse<string[]>>(`/doctor/${doctorId}/available-slots?date=${date}`),

  getAvailableDoctors: (date?: string) =>
    api.get<ApiResponse<Doctor[]>>('/doctor/available', { params: { date } }),

  getTopDoctors: (limit: number = 6) =>
    api.get<ApiResponse<DoctorListResponse[]>>(`/doctor/top?limit=${limit}`),
}
