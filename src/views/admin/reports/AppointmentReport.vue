<template>
  <AdminLayout>
    <div class="appointment-report">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Báo cáo lịch hẹn</h2>
        <div class="d-flex gap-2">
          <input type="date" class="form-control" v-model="startDate" style="width: 150px" />
          <input type="date" class="form-control" v-model="endDate" style="width: 150px" />
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
              <i class="bi bi-calendar-check"></i>
            </div>
            <div class="stat-info">
              <h3>{{ totalAppointments }}</h3>
              <p>Tổng lịch hẹn</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-warning text-white">
            <div class="stat-icon">
              <i class="bi bi-clock-history"></i>
            </div>
            <div class="stat-info">
              <h3>{{ pendingAppointments }}</h3>
              <p>Đang chờ</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-success text-white">
            <div class="stat-icon">
              <i class="bi bi-check-circle"></i>
            </div>
            <div class="stat-info">
              <h3>{{ completedAppointments }}</h3>
              <p>Hoàn thành</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-danger text-white">
            <div class="stat-icon">
              <i class="bi bi-x-circle"></i>
            </div>
            <div class="stat-info">
              <h3>{{ cancelledAppointments }}</h3>
              <p>Đã hủy</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Chart -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">Biểu đồ lịch hẹn theo ngày</h5>
        </div>
        <div class="card-body">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
          </div>
          <div v-else>
            <AppointmentChart :data="chartData" />
          </div>
        </div>
      </div>

      <!-- Status Distribution -->
      <div class="row g-4">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Phân bố trạng thái</h5>
            </div>
            <div class="card-body">
              <div class="status-distribution">
                <div v-for="status in statusData" :key="status.name" class="status-item">
                  <div class="d-flex justify-content-between align-items-center">
                    <span>
                      <span class="status-dot" :style="{ background: status.color }"></span>
                      {{ status.label }}
                    </span>
                    <span class="fw-bold">{{ status.count }} ({{ status.percentage }}%)</span>
                  </div>
                  <div class="progress mt-1">
                    <div
                      class="progress-bar"
                      role="progressbar"
                      :style="{ width: status.percentage + '%', background: status.color }"
                      :aria-valuenow="status.percentage"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Top bác sĩ</h5>
            </div>
            <div class="card-body">
              <div v-if="topDoctors.length === 0" class="text-center py-3">
                <p class="text-muted">Chưa có dữ liệu</p>
              </div>
              <div v-else>
                <div
                  v-for="(doctor, index) in topDoctors"
                  :key="doctor.doctorId"
                  class="top-doctor-item d-flex justify-content-between align-items-center border-bottom py-2"
                >
                  <div>
                    <span class="badge bg-secondary me-2">#{{ index + 1 }}</span>
                    {{ doctor.name }}
                  </div>
                  <span>{{ doctor.count }} lịch hẹn</span>
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
import AppointmentChart from '@/components/charts/AppointmentChart.vue'
import { adminAppointmentApi } from '@/api/admin/adminAppointment'
import { useToast } from '@erag/vue-toastification'
import dayjs from 'dayjs'

const toast = useToast()
const loading = ref(false)
const startDate = ref(dayjs().startOf('month').format('YYYY-MM-DD'))
const endDate = ref(dayjs().format('YYYY-MM-DD'))

const totalAppointments = ref(0)
const pendingAppointments = ref(0)
const completedAppointments = ref(0)
const cancelledAppointments = ref(0)
const dailyData = ref<{ date: string; count: number }[]>([])
const topDoctors = ref<{ doctorId: number; name: string; count: number }[]>([])

const statusColors: Record<string, string> = {
  Pending: '#ffc107',
  Confirmed: '#0dcaf0',
  Completed: '#28a745',
  Cancelled: '#dc3545',
  NoShow: '#6c757d',
}

const statusLabels: Record<string, string> = {
  Pending: 'Chờ xác nhận',
  Confirmed: 'Đã xác nhận',
  Completed: 'Hoàn thành',
  Cancelled: 'Đã hủy',
  NoShow: 'Vắng mặt',
}

const chartData = computed(() => {
  return dailyData.value.map((item) => ({
    date: dayjs(item.date).format('DD/MM'),
    appointments: item.count,
  }))
})

const statusData = computed(() => {
  const statuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'NoShow']
  return statuses.map((status) => {
    const count = statusCounts.value[status] || 0
    const percentage =
      totalAppointments.value > 0 ? Math.round((count / totalAppointments.value) * 100) : 0
    return {
      name: status,
      label: statusLabels[status],
      color: statusColors[status],
      count,
      percentage,
    }
  })
})

const statusCounts = ref<Record<string, number>>({})

const fetchReport = async () => {
  loading.value = true
  try {
    // TODO: Implement API call when backend is ready
    // const response = await adminAppointmentApi.getReport({
    //   startDate: startDate.value,
    //   endDate: endDate.value,
    // })
    // if (response.data.success) {
    //   const data = response.data.data
    //   totalAppointments.value = data.totalAppointments
    //   pendingAppointments.value = data.pendingAppointments
    //   completedAppointments.value = data.completedAppointments
    //   cancelledAppointments.value = data.cancelledAppointments
    //   dailyData.value = data.dailyData
    //   topDoctors.value = data.topDoctors
    //   statusCounts.value = data.statusCounts
    // }

    // Mock data for testing
    totalAppointments.value = 150
    pendingAppointments.value = 25
    completedAppointments.value = 100
    cancelledAppointments.value = 25

    dailyData.value = Array.from({ length: 30 }, (_, i) => ({
      date: dayjs()
        .subtract(29 - i, 'day')
        .format('YYYY-MM-DD'),
      count: Math.floor(Math.random() * 10) + 1,
    }))

    topDoctors.value = [
      { doctorId: 1, name: 'BS. Nguyễn Văn A', count: 45 },
      { doctorId: 2, name: 'BS. Trần Thị B', count: 38 },
      { doctorId: 3, name: 'BS. Lê Văn C', count: 32 },
      { doctorId: 4, name: 'BS. Phạm Thị D', count: 28 },
      { doctorId: 5, name: 'BS. Hoàng Văn E', count: 7 },
    ]

    statusCounts.value = {
      Pending: 25,
      Confirmed: 30,
      Completed: 70,
      Cancelled: 25,
      NoShow: 0,
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
.appointment-report {
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

.status-item {
  margin-bottom: 15px;
}

.status-item:last-child {
  margin-bottom: 0;
}

.status-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
}

.progress {
  height: 8px;
  border-radius: 4px;
}

.top-doctor-item:last-child {
  border-bottom: none !important;
}
</style>
