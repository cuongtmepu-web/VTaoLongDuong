import api from './axios'
import { type ApiResponse } from '@/api/types/common'

import { type LandingSection, type LandingSectionContent } from './types/landing'

export const landingApi = {
  getAll: () => api.get<ApiResponse<LandingSection[]>>('/landing'),

  getSection: (key: string) => api.get<ApiResponse<LandingSection>>(`/landing/${key}`),
}
