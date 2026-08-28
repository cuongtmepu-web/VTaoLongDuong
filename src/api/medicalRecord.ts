import api from './axios'
import { type MedicalRecord } from './types/medicalRecord'
import { type ApiResponse } from './types/common'

export const medicalRecordApi = {
  getAll: () => api.get<ApiResponse<MedicalRecord[]>>('/medicalrecord'),

  getById: (id: number) => api.get<ApiResponse<MedicalRecord>>(`/medicalrecord/${id}`),
}
