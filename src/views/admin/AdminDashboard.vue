<template>
  <AdminLayout>
    <div class="admin-dashboard">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Dashboard</h2>
        <span class="text-muted">Cập nhật: {{ now }}</span>
      </div>

      <!-- Stats -->
      <div class="row g-4 mb-4">
        <div class="col-md-3" v-for="stat in statsData" :key="stat.title">
          <div class="stat-card" :style="{ background: stat.color }">
            <div class="stat-icon">
              <i :class="stat.icon"></i>
            </div>
            <div class="stat-info">
              <h3>{{ stat.value }}</h3>
              <p>{{ stat.title }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Orders & Appointments -->
      <div class="row g-4">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Đơn hàng gần đây</h5>
              <router-link to="/admin/orders" class="btn btn-sm btn-primary"
                >Xem tất cả</router-link
              >
            </div>
            <div class="card-body">
              <div v-if="loading" class="text-center py-3">
                <div class="spinner-border spinner-border-sm"></div>
              </div>
              <div v-else-if="recentOrders.length === 0" class="text-center py-3">
                <p class="text-muted">Chưa có đơn hàng</p>
              </div>
              <div v-else>
                <div
                  v-for="order in recentOrders"
                  :key="order.orderCode"
                  class="order-item d-flex justify-content-between align-items-center border-bottom py-2"
                >
                  <div>
                    <span class="fw-bold">{{ order.orderCode }}</span>
                    <small class="text-muted d-block">{{ order.userName }}</small>
                  </div>
                  <div class="text-end">
                    <span class="fw-bold">{{ formatCurrency(order.finalAmount) }}</span>
                    <span :class="getPaymentStatusClass(order.paymentStatus)" class="badge ms-2">
                      {{ getPaymentStatusText(order.paymentStatus) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Lịch hẹn mới nhất</h5>
              <router-link to="/admin/appointments" class="btn btn-sm btn-primary"
                >Xem tất cả</router-link
              >
            </div>
            <div class="card-body">
              <div v-if="loading" class="text-center py-3">
                <div class="spinner-border spinner-border-sm"></div>
              </div>
              <div v-else-if="recentAppointments.length === 0" class="text-center py-3">
                <p class="text-muted">Chưa có lịch hẹn</p>
              </div>
              <div v-else>
                <div
                  v-for="appt in recentAppointments"
                  :key="appt.appointmentId"
                  class="appointment-item d-flex justify-content-between align-items-center border-bottom py-2"
                >
                  <div>
                    <span class="fw-bold">{{ appt.userName }}</span>
                    <small class="text-muted d-block">BS: {{ appt.doctorName }}</small>
                  </div>
                  <div class="text-end">
                    <span class="small">{{ formatDate(appt.appointmentDate) }}</span>
                    <span :class="getStatusClass(appt.status)" class="badge ms-2">
                      {{ getStatusText(appt.status) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { adminDashboardApi } from '@/api/admin/adminDashboard'
import type { DashboardStats } from '@/api/admin/adminDashboard'
import dayjs from 'dayjs'

const loading = ref(false)
const stats = ref<DashboardStats>({
  totalUsers: 0,
  totalDoctors: 0,
  totalAppointments: 0,
  pendingAppointments: 0,
  totalOrders: 0,
  totalRevenue: 0,
  todayAppointments: 0,
  todayRevenue: 0,
  recentOrders: [],
  recentAppointments: [],
})

const recentOrders = ref<any[]>([])
const recentAppointments = ref<any[]>([])

const now = computed(() => dayjs().format('DD/MM/YYYY HH:mm'))

const statsData = computed(() => [
  {
    title: 'Người dùng',
    value: stats.value.totalUsers,
    icon: 'bi bi-people',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    title: 'Bác sĩ',
    value: stats.value.totalDoctors,
    icon: 'bi bi-person-heart',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    title: 'Lịch hẹn',
    value: stats.value.totalAppointments,
    icon: 'bi bi-calendar-check',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    title: 'Doanh thu',
    value: formatCurrency(stats.value.totalRevenue),
    icon: 'bi bi-currency-dollar',
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  },
])

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

const formatDate = (date: string) => {
  return dayjs(date).format('DD/MM/YYYY')
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    Pending: 'bg-warning',
    Confirmed: 'bg-info',
    Completed: 'bg-success',
    Cancelled: 'bg-danger',
    NoShow: 'bg-secondary',
  }
  return classes[status] || 'bg-secondary'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    Pending: 'Chờ xác nhận',
    Confirmed: 'Đã xác nhận',
    Completed: 'Hoàn thành',
    Cancelled: 'Đã hủy',
    NoShow: 'Vắng mặt',
  }
  return texts[status] || status
}

const getPaymentStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    Pending: 'bg-warning',
    Paid: 'bg-success',
    Failed: 'bg-danger',
    Refunded: 'bg-info',
  }
  return classes[status] || 'bg-secondary'
}

const getPaymentStatusText = (status: string) => {
  const texts: Record<string, string> = {
    Pending: 'Chờ thanh toán',
    Paid: 'Đã thanh toán',
    Failed: 'Thất bại',
    Refunded: 'Đã hoàn',
  }
  return texts[status] || status
}

const fetchDashboardData = async () => {
  loading.value = true
  try {
    const response = await adminDashboardApi.getStats()
    if (response.data.success) {
      const data = response.data.data
      stats.value = data
      recentOrders.value = data.recentOrders || []
      recentAppointments.value = data.recentAppointments || []
    }
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
}

.stat-card {
  padding: 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 15px;
  color: white;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 2.5rem;
  opacity: 0.8;
}

.stat-info h3 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: bold;
}

.stat-info p {
  margin: 0;
  opacity: 0.9;
}

.order-item:last-child,
.appointment-item:last-child {
  border-bottom: none !important;
}
</style>
