<template>
  <AdminLayout>
    <div class="revenue-report">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Báo cáo doanh thu</h2>
        <div class="d-flex gap-2">
          <BaseSelect
            v-model="year"
            :options="years.map((y) => ({ value: y, label: String(y) }))"
            style="width: 100px"
          />
          <BaseSelect
            v-model="month"
            :options="months.map((m) => ({ value: m.value, label: m.label }))"
            style="width: 100px"
          />
          <button class="btn btn-primary" @click="fetchReport">
            <i class="bi bi-search"></i> Xem
          </button>
          <button class="btn btn-success" @click="exportReport">
            <i class="bi bi-download"></i> Xuất Excel
          </button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="row g-4 mb-4">
        <div class="col-md-3">
          <div class="stat-card bg-primary text-white">
            <div class="stat-icon">
              <i class="bi bi-currency-dollar"></i>
            </div>
            <div class="stat-info">
              <h3>{{ formatCurrency(totalRevenue) }}</h3>
              <p>Tổng doanh thu</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-success text-white">
            <div class="stat-icon">
              <i class="bi bi-receipt"></i>
            </div>
            <div class="stat-info">
              <h3>{{ totalOrders }}</h3>
              <p>Tổng đơn hàng</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-info text-white">
            <div class="stat-icon">
              <i class="bi bi-calendar-check"></i>
            </div>
            <div class="stat-info">
              <h3>{{ averageOrder }}</h3>
              <p>Trung bình/đơn</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-warning text-white">
            <div class="stat-icon">
              <i class="bi bi-arrow-up"></i>
            </div>
            <div class="stat-info">
              <h3>{{ growthRate }}%</h3>
              <p>Tăng trưởng</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Chart -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">Biểu đồ doanh thu theo ngày</h5>
        </div>
        <div class="card-body">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
          </div>
          <div v-else>
            <RevenueChart :data="chartData" />
          </div>
        </div>
      </div>

      <!-- Daily Data -->
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">Chi tiết theo ngày</h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th class="text-end">Số đơn hàng</th>
                  <th class="text-end">Doanh thu</th>
                  <th class="text-end">Trung bình/đơn</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in dailyData" :key="item.date">
                  <td>{{ formatDate(item.date) }}</td>
                  <td class="text-end">{{ item.count }}</td>
                  <td class="text-end fw-bold">{{ formatCurrency(item.total) }}</td>
                  <td class="text-end">{{ formatCurrency(item.total / (item.count || 1)) }}</td>
                </tr>
              </tbody>
              <tfoot class="fw-bold">
                <tr>
                  <td>Tổng</td>
                  <td class="text-end">{{ totalOrders }}</td>
                  <td class="text-end text-primary">{{ formatCurrency(totalRevenue) }}</td>
                  <td class="text-end">{{ formatCurrency(totalRevenue / (totalOrders || 1)) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import RevenueChart from '@/components/charts/RevenueChart.vue'
import { adminDashboardApi } from '@/api/admin/adminDashboard'
import { useToast } from '@erag/vue-toastification'
import dayjs from 'dayjs'

const toast = useToast()
const loading = ref(false)
const year = ref(dayjs().year())
const month = ref(dayjs().month() + 1)

const dailyData = ref<{ date: string; total: number; count: number }[]>([])
const totalRevenue = ref(0)
const totalOrders = ref(0)
const growthRate = ref(0)

const years = computed(() => {
  const currentYear = dayjs().year()
  const years = []
  for (let y = currentYear - 5; y <= currentYear; y++) {
    years.push(y)
  }
  return years
})

const months = [
  { value: 1, label: 'Tháng 1' },
  { value: 2, label: 'Tháng 2' },
  { value: 3, label: 'Tháng 3' },
  { value: 4, label: 'Tháng 4' },
  { value: 5, label: 'Tháng 5' },
  { value: 6, label: 'Tháng 6' },
  { value: 7, label: 'Tháng 7' },
  { value: 8, label: 'Tháng 8' },
  { value: 9, label: 'Tháng 9' },
  { value: 10, label: 'Tháng 10' },
  { value: 11, label: 'Tháng 11' },
  { value: 12, label: 'Tháng 12' },
]

const averageOrder = computed(() => {
  if (totalOrders.value === 0) return '0'
  return formatCurrency(totalRevenue.value / totalOrders.value)
})

const chartData = computed(() => {
  return dailyData.value.map((item) => ({
    date: dayjs(item.date).format('DD/MM'),
    revenue: item.total,
  }))
})

const formatDate = (date: string) => {
  return dayjs(date).format('DD/MM/YYYY')
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

const fetchReport = async () => {
  loading.value = true
  try {
    const response = await adminDashboardApi.getRevenueReport({
      year: year.value,
      month: month.value,
    })
    if (response.data.success) {
      const data = response.data.data
      dailyData.value = data.dailyData || []
      totalRevenue.value = data.totalRevenue || 0
      totalOrders.value = data.totalOrders || 0
      growthRate.value = Math.round(Math.random() * 20 + 5) // Mock growth
    }
  } catch (error) {
    toast.error('Không thể tải báo cáo')
  } finally {
    loading.value = false
  }
}

const exportReport = () => {
  toast.info('Chức năng đang được phát triển')
}

onMounted(() => {
  fetchReport()
})
</script>

<style scoped>
.revenue-report {
  padding: 20px;
}

.stat-card {
  padding: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  font-size: 2rem;
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
</style>
