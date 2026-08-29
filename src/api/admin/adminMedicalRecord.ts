import api from '../axios'
import { type MedicalRecord, type CreateMedicalRecordRequest } from '@/api/types/medicalRecord'
import { type ApiResponse } from '@/api/types/common'

export const adminMedicalRecordApi = {
  getAll: () => api.get<ApiResponse<MedicalRecord[]>>('/admin/medical-records'),

  getById: (id: number) => api.get<ApiResponse<MedicalRecord>>(`/admin/medical-records/${id}`),

  create: (data: CreateMedicalRecordRequest) =>
    api.post<ApiResponse<MedicalRecord>>('/admin/medical-records', data),

  update: (id: number, data: Partial<CreateMedicalRecordRequest>) =>
    api.put<ApiResponse<null>>(`/admin/medical-records/${id}`, data),

  delete: (id: number) => api.delete<ApiResponse<null>>(`/admin/medical-records/${id}`),
}
