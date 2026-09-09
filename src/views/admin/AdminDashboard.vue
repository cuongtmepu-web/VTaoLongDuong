<template>
  <AdminLayout>
    <div class="admin-dashboard">
      <div class="dashboard-heading">
        <div>
          <p class="eyebrow mb-1">Tổng quan vận hành</p>
          <h2 class="mb-1">Dashboard</h2>
          <p class="text-muted mb-0">Theo dõi hoạt động phòng khám trong một ánh nhìn.</p>
        </div>
        <span class="update-time"><i class="bi bi-clock-history"></i> {{ now }}</span>
      </div>

      <!-- Stats -->
      <div class="row g-3 mb-4">
        <div class="col-sm-6 col-xl-3" v-for="stat in statsData" :key="stat.title">
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

      <div class="row g-4 mb-4">
        <div class="col-xl-8">
          <section class="dashboard-panel chart-panel">
            <div class="panel-heading">
              <div>
                <span class="panel-kicker">Tài chính</span>
                <h3>Doanh thu theo ngày</h3>
              </div>
              <i class="bi bi-graph-up-arrow panel-icon"></i>
            </div>
            <div v-if="loadingRevenue" class="chart-placeholder">
              <div class="spinner-border spinner-border-sm text-primary"></div>
            </div>
            <div v-else-if="revenueData.length === 0" class="chart-placeholder empty-chart">
              <i class="bi bi-bar-chart-line"></i>
              <span>Chưa có dữ liệu doanh thu trong kỳ này</span>
            </div>
            <div v-else class="chart-canvas-wrap">
              <canvas ref="revenueCanvas"></canvas>
            </div>
          </section>
        </div>
        <div class="col-xl-4">
          <section class="dashboard-panel chart-panel">
            <div class="panel-heading">
              <div>
                <span class="panel-kicker">Hoạt động</span>
                <h3>Tổng quan hệ thống</h3>
              </div>
              <i class="bi bi-bar-chart-fill panel-icon"></i>
            </div>
            <div class="chart-canvas-wrap compact-chart">
              <canvas ref="overviewCanvas"></canvas>
            </div>
          </section>
        </div>
      </div>

      <div class="row g-4 mb-4">
        <div class="col-lg-4">
          <section class="dashboard-panel chart-panel">
            <div class="panel-heading">
              <div>
                <span class="panel-kicker">Lịch hẹn</span>
                <h3>Trạng thái lịch hẹn</h3>
              </div>
              <i class="bi bi-pie-chart-fill panel-icon"></i>
            </div>
            <div class="chart-canvas-wrap compact-chart">
              <canvas ref="appointmentCanvas"></canvas>
            </div>
          </section>
        </div>
        <div class="col-lg-8">
          <section class="dashboard-panel insight-panel">
            <div class="panel-heading">
              <div>
                <span class="panel-kicker">Điểm nhấn hôm nay</span>
                <h3>Nhịp vận hành</h3>
              </div>
              <i class="bi bi-lightning-charge-fill panel-icon"></i>
            </div>
            <div class="insight-grid">
              <div class="insight-item">
                <span>Lịch hẹn hôm nay</span>
                <strong>{{ stats.todayAppointments }}</strong>
                <small><i class="bi bi-calendar-event"></i> cần theo dõi trong ngày</small>
              </div>
              <div class="insight-item">
                <span>Doanh thu hôm nay</span>
                <strong>{{ formatCurrency(stats.todayRevenue) }}</strong>
                <small><i class="bi bi-cash-coin"></i> ghi nhận trong ngày</small>
              </div>
              <div class="insight-item">
                <span>Lịch hẹn chờ xử lý</span>
                <strong>{{ stats.pendingAppointments }}</strong>
                <small><i class="bi bi-hourglass-split"></i> ưu tiên xác nhận</small>
              </div>
            </div>
          </section>
        </div>
      </div>

      <!-- Recent Orders & Appointments -->
      <div class="row g-4">
        <div class="col-lg-6">
          <div class="dashboard-panel list-panel">
            <div class="panel-heading">
              <h3>Đơn hàng gần đây</h3>
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
        <div class="col-lg-6">
          <div class="dashboard-panel list-panel">
            <div class="panel-heading">
              <h3>Lịch hẹn mới nhất</h3>
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
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { adminDashboardApi } from '@/api/admin/adminDashboard'
import type { DashboardStats } from '@/api/admin/adminDashboard'
import { Chart, registerables, type ChartConfiguration } from 'chart.js'
import dayjs from 'dayjs'

Chart.register(...registerables)

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
const revenueData = ref<{ date: string; total: number; count: number }[]>([])
const loadingRevenue = ref(false)
const revenueCanvas = ref<HTMLCanvasElement | null>(null)
const overviewCanvas = ref<HTMLCanvasElement | null>(null)
const appointmentCanvas = ref<HTMLCanvasElement | null>(null)
let revenueChart: Chart | null = null
let overviewChart: Chart | null = null
let appointmentChart: Chart | null = null

const now = computed(() => dayjs().format('DD/MM/YYYY HH:mm'))

const statsData = computed(() => [
  {
    title: 'Người dùng',
    value: stats.value.totalUsers,
    icon: 'bi bi-people',
    color: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
  },
  {
    title: 'Bác sĩ',
    value: stats.value.totalDoctors,
    icon: 'bi bi-person-heart',
    color: 'linear-gradient(135deg, var(--secondary), var(--secondary-dark))',
  },
  {
    title: 'Lịch hẹn',
    value: stats.value.totalAppointments,
    icon: 'bi bi-calendar-check',
    color: 'linear-gradient(135deg, #668b86, var(--primary))',
  },
  {
    title: 'Doanh thu',
    value: formatCurrency(stats.value.totalRevenue),
    icon: 'bi bi-currency-dollar',
    color: 'linear-gradient(135deg, var(--gold), var(--secondary))',
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

const destroyCharts = () => {
  revenueChart?.destroy()
  overviewChart?.destroy()
  appointmentChart?.destroy()
  revenueChart = null
  overviewChart = null
  appointmentChart = null
}

const renderCharts = () => {
  destroyCharts()

  if (revenueCanvas.value && revenueData.value.length > 0) {
    revenueChart = new Chart(revenueCanvas.value, {
      type: 'line',
      data: {
        labels: revenueData.value.map((item) => dayjs(item.date).format('DD/MM')),
        datasets: [
          {
            label: 'Doanh thu',
            data: revenueData.value.map((item) => item.total),
            borderColor: '#2f6f63',
            backgroundColor: 'rgba(47, 111, 99, 0.12)',
            fill: true,
            tension: 0.35,
            pointRadius: 3,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `${Number(value).toLocaleString('vi-VN')} đ`,
            },
            grid: { color: 'rgba(47, 111, 99, 0.08)' },
          },
          x: { grid: { display: false } },
        },
      },
    } as ChartConfiguration)
  }

  if (overviewCanvas.value) {
    overviewChart = new Chart(overviewCanvas.value, {
      type: 'bar',
      data: {
        labels: ['Người dùng', 'Bác sĩ', 'Lịch hẹn', 'Đơn hàng'],
        datasets: [
          {
            data: [
              stats.value.totalUsers,
              stats.value.totalDoctors,
              stats.value.totalAppointments,
              stats.value.totalOrders,
            ],
            backgroundColor: ['#2f6f63', '#b97a45', '#668b86', '#ad8a4d'],
            borderRadius: 7,
            maxBarThickness: 34,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(47, 111, 99, 0.08)' } },
          x: { grid: { display: false } },
        },
      },
    } as ChartConfiguration)
  }

  if (appointmentCanvas.value) {
    const pending = stats.value.pendingAppointments
    const completed = Math.max(stats.value.totalAppointments - pending, 0)
    appointmentChart = new Chart(appointmentCanvas.value, {
      type: 'doughnut',
      data: {
        labels: ['Chờ xác nhận', 'Đã xử lý'],
        datasets: [
          { data: [pending, completed], backgroundColor: ['#b97a45', '#2f6f63'], borderWidth: 0 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: { legend: { position: 'bottom', labels: { padding: 18 } } },
      },
    } as ChartConfiguration)
  }
}

const fetchDashboardData = async () => {
  loading.value = true
  loadingRevenue.value = true
  try {
    const response = await adminDashboardApi.getStats()
    if (response.data.success) {
      const data = response.data.data
      stats.value = data
      recentOrders.value = data.recentOrders || []
      recentAppointments.value = data.recentAppointments || []
    }
    try {
      const revenueResponse = await adminDashboardApi.getRevenueReport({
        year: dayjs().year(),
        month: dayjs().month() + 1,
      })
      if (revenueResponse.data.success) {
        revenueData.value = revenueResponse.data.data.dailyData || []
      }
    } catch (error) {
      console.error('Failed to fetch revenue report:', error)
    }
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  } finally {
    loading.value = false
    loadingRevenue.value = false
    await nextTick()
    renderCharts()
  }
}

onMounted(() => {
  fetchDashboardData()
})

watch(stats, async () => {
  await nextTick()
  if (!loading.value) renderCharts()
})

onBeforeUnmount(destroyCharts)
</script>

<style scoped>
.admin-dashboard {
  max-width: 1500px;
  margin: 0 auto;
}

.dashboard-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.75rem;
}

.eyebrow,
.panel-kicker {
  color: var(--secondary-dark);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.dashboard-heading h2 {
  color: var(--primary-dark);
  font-family: var(--font-heading);
  font-size: clamp(2rem, 3vw, 2.8rem);
}

.update-time {
  color: var(--text-muted);
  font-size: 0.82rem;
  white-space: nowrap;
}

.update-time i {
  color: var(--secondary);
  margin-right: 0.25rem;
}

.stat-card {
  min-height: 112px;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 15px;
  color: white;
  transition: transform 0.3s;
}

.dashboard-panel {
  height: 100%;
  padding: 1.25rem;
  background: rgba(255, 253, 248, 0.88);
  border: 1px solid rgba(47, 111, 99, 0.08);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.panel-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.panel-heading h3 {
  margin: 0.15rem 0 0;
  color: var(--primary-dark);
  font-family: var(--font-heading);
  font-size: 1.35rem;
  font-weight: 700;
}

.panel-icon {
  color: var(--gold);
  font-size: 1.25rem;
}

.chart-panel {
  min-height: 345px;
}

.chart-canvas-wrap {
  position: relative;
  height: 260px;
}

.compact-chart {
  height: 255px;
}

.chart-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 260px;
  color: var(--text-muted);
}

.empty-chart {
  flex-direction: column;
  gap: 0.5rem;
}

.empty-chart i {
  color: var(--gold);
  font-size: 2rem;
}

.insight-panel {
  min-height: 345px;
}

.insight-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.85rem;
}

.insight-item {
  min-height: 200px;
  padding: 1rem;
  background: var(--surface-alt);
  border-radius: var(--radius-sm);
}

.insight-item span,
.insight-item small {
  display: block;
  color: var(--text-muted);
}

.insight-item span {
  min-height: 2.5rem;
  font-size: 0.78rem;
  font-weight: 700;
}

.insight-item strong {
  display: block;
  margin: 0.75rem 0;
  color: var(--primary-dark);
  font-size: 1.35rem;
}

.insight-item small {
  font-size: 0.72rem;
  line-height: 1.45;
}

.insight-item small i {
  color: var(--secondary);
  margin-right: 0.2rem;
}

.list-panel {
  min-height: 220px;
}

.list-panel .panel-heading {
  align-items: center;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid var(--surface-border);
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

@media (max-width: 1024px) {
  .dashboard-heading {
    margin-bottom: 1.5rem;
  }

  .dashboard-panel {
    padding: 1.1rem;
  }

  .panel-heading h3 {
    font-size: 1.25rem;
  }

  .chart-panel,
  .insight-panel {
    min-height: 315px;
  }

  .chart-canvas-wrap {
    height: 235px;
  }

  .compact-chart {
    height: 225px;
  }
}

@media (max-width: 768px) {
  .dashboard-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .insight-grid {
    grid-template-columns: 1fr;
  }

  .insight-item {
    min-height: auto;
  }

  .dashboard-heading {
    margin-bottom: 1.25rem;
  }

  .dashboard-heading h2 {
    font-size: 2.15rem;
  }

  .dashboard-panel {
    padding: 1rem;
  }

  .panel-heading h3 {
    font-size: 1.2rem;
  }

  .chart-panel,
  .insight-panel {
    min-height: 0;
  }

  .chart-canvas-wrap,
  .chart-placeholder {
    height: 220px;
  }

  .compact-chart {
    height: 215px;
  }

  .order-item,
  .appointment-item {
    align-items: flex-start !important;
    gap: 0.75rem;
  }

  .order-item > div:last-child,
  .appointment-item > div:last-child {
    flex-shrink: 0;
  }
}

@media (max-width: 576px) {
  .dashboard-heading {
    gap: 0.4rem;
    margin-bottom: 1.1rem;
  }

  .dashboard-heading h2 {
    font-size: 2rem;
  }

  .dashboard-heading .text-muted {
    max-width: 28rem;
    font-size: 0.88rem;
    line-height: 1.45;
  }

  .update-time {
    font-size: 0.75rem;
  }

  .stat-card {
    min-height: 108px;
    padding: 0.85rem;
    gap: 0.65rem;
    border-radius: var(--radius-md);
  }

  .stat-icon {
    flex: 0 0 auto;
    font-size: 1.9rem;
  }

  .stat-info h3 {
    font-size: 1.35rem;
  }

  .stat-info p {
    font-size: 0.8rem;
    line-height: 1.25;
  }

  .panel-heading {
    gap: 0.5rem;
  }

  .panel-heading h3 {
    font-size: 1.15rem;
    line-height: 1.25;
  }

  .dashboard-panel {
    border-radius: var(--radius-md);
  }

  .list-panel .panel-heading .btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.78rem;
  }

  .order-item,
  .appointment-item {
    flex-direction: column;
  }

  .order-item > div:last-child,
  .appointment-item > div:last-child {
    width: 100%;
    text-align: left !important;
  }

  .order-item .badge,
  .appointment-item .badge {
    margin-left: 0.35rem !important;
  }
}
</style>
