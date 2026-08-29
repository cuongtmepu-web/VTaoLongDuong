import api from '../axios'
import { type ApiResponse } from '@/api/types/common'

export interface SystemSetting {
  settingId: number
  settingKey: string
  settingValue: string
  description?: string
  groupName?: string
  updatedAt: string
}

export const systemSettingsApi = {
  getAll: () => api.get<ApiResponse<SystemSetting[]>>('/admin/settings'),

  getGroup: (group: string) =>
    api.get<ApiResponse<SystemSetting[]>>(`/admin/settings/group/${group}`),

  getByKey: (key: string) => api.get<ApiResponse<SystemSetting>>(`/admin/settings/${key}`),

  update: (key: string, value: string) =>
    api.put<ApiResponse<null>>(`/admin/settings/${key}`, { value }),

  updateGroup: (data: { key: string; value: string }[]) =>
    api.put<ApiResponse<null>>('/admin/settings', data),
}
