export interface User {
  userId: number
  username: string
  fullName: string
  email: string
  phone: string
  role: 'Admin' | 'Doctor' | 'User'
  isActive: boolean
  avatarUrl?: string
  dateOfBirth?: string
  gender?: number
  address?: string
  createdAt: string
  lastLogin?: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
  expiresAt: string
}

export interface RegisterRequest {
  username: string
  password: string
  confirmPassword: string
  email: string
  fullName: string
  phone: string
  dateOfBirth?: string
  gender?: number
  address?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface UpdateProfileRequest {
  fullName?: string
  phone?: string
  dateOfBirth?: string
  gender?: number
  address?: string
  avatarUrl?: string
}
