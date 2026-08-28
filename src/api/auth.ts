import api from './axios'
import {
  type LoginRequest,
  type LoginResponse,
  type RegisterRequest,
  type ChangePasswordRequest,
  type UpdateProfileRequest,
  type User,
} from './types/auth'
import { type ApiResponse } from './types/common'

export const authApi = {
  register: (data: RegisterRequest) => api.post<ApiResponse<User>>('/auth/register', data),

  login: (data: LoginRequest) => api.post<ApiResponse<LoginResponse>>('/auth/login', data),

  getProfile: () => api.get<ApiResponse<User>>('/auth/profile'),

  updateProfile: (data: UpdateProfileRequest) => api.put<ApiResponse<User>>('/auth/profile', data),

  changePassword: (data: ChangePasswordRequest) =>
    api.put<ApiResponse<null>>('/auth/change-password', data),
}
