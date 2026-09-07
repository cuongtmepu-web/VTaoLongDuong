import api from '../axios'
import { type ApiResponse } from '@/api/types/common'

export interface LandingSection {
  sectionKey: string
  sectionName: string
  contentJson: string
  updatedAt: string
}

export interface LandingSectionContent {
  [key: string]: any
}

export const landingApi = {
  getAll: () => api.get<ApiResponse<LandingSection[]>>('/admin/adminlanding'),

  getSection: (key: string) => api.get<ApiResponse<LandingSection>>(`/admin/adminlanding/${key}`),

  update: (key: string, data: { contentJson: string }) =>
    api.put<ApiResponse<null>>(`/admin/adminlanding/${key}`, data),

  uploadImage: (file: File) => {
    const formData = new FormData()
    formData.append('image', file)
    return api.post<ApiResponse<{ url: string }>>('/admin/adminlanding/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  deleteImage: (url: string) =>
    api.delete<ApiResponse<null>>('/admin/adminlanding/image', { data: { url } }),
}
