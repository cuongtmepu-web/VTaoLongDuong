import api from './axios'
import { type Appointment, type BookAppointmentRequest } from './types/appointment'
import { type ApiResponse } from './types/common'

export const appointmentApi = {
  getAll: () => api.get<ApiResponse<Appointment[]>>('/appointment'),

  getById: (id: number) => api.get<ApiResponse<Appointment>>(`/appointment/${id}`),

  create: (data: BookAppointmentRequest) =>
    api.post<ApiResponse<{ appointmentId: number }>>('/appointment', data),

  cancel: (id: number, reason?: string) =>
    api.put<ApiResponse<null>>(`/appointment/${id}/cancel`, { reason }),
}
