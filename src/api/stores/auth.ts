import { defineStore } from 'pinia'
import { authApi } from '@/api/auth'
import router from '@/router'
import { useToast } from '@erag/vue-toastification'
import {
  type User,
  type LoginResponse,
  type RegisterRequest,
  type UpdateProfileRequest,
  type ChangePasswordRequest,
} from '@/api/types/auth'

const toast = useToast()

const normalizeRole = (role: unknown): User['role'] => {
  const roleValue = String(role)

  if (roleValue === '1' || roleValue === 'Admin') return 'Admin'
  if (roleValue === '2' || roleValue === 'Doctor') return 'Doctor'
  return 'User'
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
  }),

  getters: {
    isAdmin: (state): boolean => state.user?.role === 'Admin',
    isUser: (state): boolean => state.user?.role === 'User',
    isDoctor: (state): boolean => state.user?.role === 'Doctor',
    fullName: (state): string => state.user?.fullName || '',
    userId: (state): number => state.user?.userId || 0,
  },

  actions: {
    async login(username: string, password: string): Promise<boolean> {
      try {
        const response = await authApi.login({ username, password })
        const data = response.data

        if (data.success) {
          const user = {
            ...data.data.user,
            role: normalizeRole(data.data.user.role),
          }

          this.user = user
          this.token = data.data.token
          this.isAuthenticated = true

          localStorage.setItem('token', data.data.token)
          localStorage.setItem('user', JSON.stringify(user))
          localStorage.setItem('role', user.role)

          toast.success('Đăng nhập thành công!')

          if (user.role === 'Admin') {
            router.push('/admin/dashboard')
          } else {
            router.push('/user/dashboard')
          }

          return true
        }
        return false
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Đăng nhập thất bại')
        return false
      }
    },

    async register(userData: RegisterRequest): Promise<boolean> {
      try {
        const response = await authApi.register(userData)
        if (response.data.success) {
          toast.success('Đăng ký thành công! Vui lòng đăng nhập.')
          router.push('/login')
          return true
        }
        return false
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Đăng ký thất bại')
        return false
      }
    },

    logout(): void {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('role')
      router.push('/')
      toast.info('Đã đăng xuất')
    },

    async updateProfile(data: UpdateProfileRequest): Promise<boolean> {
      try {
        const response = await authApi.updateProfile(data)
        if (response.data.success) {
          this.user = { ...this.user, ...data } as User
          localStorage.setItem('user', JSON.stringify(this.user))
          toast.success('Cập nhật thông tin thành công!')
          return true
        }
        return false
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Cập nhật thất bại')
        return false
      }
    },

    async changePassword(data: ChangePasswordRequest): Promise<boolean> {
      try {
        const response = await authApi.changePassword(data)
        if (response.data.success) {
          toast.success('Đổi mật khẩu thành công!')
          return true
        }
        return false
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Đổi mật khẩu thất bại')
        return false
      }
    },
  },
})
