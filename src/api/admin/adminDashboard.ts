import api from '../axios'
import { type ApiResponse } from '@/api/types/common'

export interface DashboardStats {
  totalUsers: number
  totalDoctors: number
  totalAppointments: number
  pendingAppointments: number
  totalOrders: number
  totalRevenue: number
  todayAppointments: number
  todayRevenue: number
  recentOrders: any[]
  recentAppointments: any[]
}

export interface RevenueReport {
  year: number
  month: number
  dailyData: { date: string; total: number; count: number }[]
  totalRevenue: number
  totalOrders: number
}

export const adminDashboardApi = {
  getStats: () => api.get<ApiResponse<DashboardStats>>('/admin/dashboard/stats'),

  getRevenueReport: (params?: { year?: number; month?: number }) =>
    api.get<ApiResponse<RevenueReport>>('/admin/dashboard/revenue', { params }),
}
