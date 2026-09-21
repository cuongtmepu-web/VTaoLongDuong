<template>
  <AdminLayout>
    <div class="appointment-list">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Quản lý lịch hẹn</h2>
        <div class="d-flex gap-2">
          <input
            type="text"
            class="form-control"
            v-model="search"
            placeholder="Tìm kiếm..."
            style="width: 200px"
            @input="onSearch"
          />
          <BaseSelect
            v-model="statusFilter"
            :options="[
              { value: '', label: 'Tất cả trạng thái' },
              { value: 'Pending', label: 'Chờ xác nhận' },
              { value: 'Confirmed', label: 'Đã xác nhận' },
              { value: 'Completed', label: 'Hoàn thành' },
              { value: 'Cancelled', label: 'Đã hủy' },
            ]"
            style="width: 150px"
            @update:model-value="onSearch"
          />
          <DatePicker
            v-model="dateFilter"
            label="Lọc theo ngày"
            style="width: 150px"
            @update:model-value="onSearch"
          />
          <button class="btn btn-primary" @click="fetchAppointments">
            <i class="bi bi-search"></i> Tìm
          </button>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
          </div>
          <div v-else>
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Người dùng</th>
                    <th>Bác sĩ</th>
                    <th>Ngày hẹn</th>
                    <th>Giờ</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="appt in appointments" :key="appt.appointmentId">
                    <td>{{ appt.appointmentId }}</td>
                    <td>
                      <div>
                        <div class="fw-bold">{{ appt.userName }}</div>
                        <small class="text-muted">{{ appt.phone }}</small>
                      </div>
                    </td>
                    <td>{{ appt.doctorName }}</td>
                    <td>{{ formatDate(appt.appointmentDate) }}</td>
                    <td>{{ formatTime(appt.appointmentTime) }}</td>
                    <td>
                      <span :class="getStatusClass(appt.status)" class="badge">
                        {{ getStatusText(appt.status) }}
                      </span>
                    </td>
                    <td>
                      <div class="btn-group">
                        <router-link
                          :to="`/admin/appointments/${appt.appointmentId}`"
                          class="btn btn-sm btn-outline-primary"
                        >
                          <i class="bi bi-eye"></i>
                        </router-link>
                        <button
                          v-if="appt.status === 'Pending'"
                          class="btn btn-sm btn-outline-success"
                          @click="updateStatus(appt.appointmentId, 'Confirmed')"
                        >
                          <i class="bi bi-check"></i>
                        </button>
                        <button
                          v-if="appt.status === 'Pending' || appt.status === 'Confirmed'"
                          class="btn btn-sm btn-outline-danger"
                          @click="updateStatus(appt.appointmentId, 'Cancelled')"
                        >
                          <i class="bi bi-x"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div class="d-flex justify-content-between align-items-center mt-3">
              <span class="text-muted">
                Hiển thị {{ (pagination.currentPage - 1) * pagination.pageSize + 1 }} -
                {{ Math.min(pagination.currentPage * pagination.pageSize, pagination.totalCount) }}
                / {{ pagination.totalCount }} lịch hẹn
              </span>
              <nav>
                <ul class="pagination mb-0">
                  <li class="page-item" :class="{ disabled: pagination.currentPage === 1 }">
                    <a
                      class="page-link"
                      href="/"
                      @click.prevent="changePage(pagination.currentPage - 1)"
                      >Trước</a
                    >
                  </li>
                  <li
                    v-for="page in totalPages"
                    :key="page"
                    class="page-item"
                    :class="{ active: page === pagination.currentPage }"
                  >
                    <a class="page-link" href="/" @click.prevent="changePage(page)">{{ page }}</a>
                  </li>
                  <li
                    class="page-item"
                    :class="{ disabled: pagination.currentPage === totalPages }"
                  >
                    <a
                      class="page-link"
                      href="/"
                      @click.prevent="changePage(pagination.currentPage + 1)"
                      >Sau</a
                    >
                  </li>
                </ul>
              </nav>
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
import BaseSelect from '@/components/common/BaseSelect.vue'
import DatePicker from '@/components/common/DatePicker.vue'
import { adminAppointmentApi } from '@/api/admin/adminAppointment'
import type { Appointment, AppointmentStatus } from '@/api/types/appointment'
import { useToast } from '@erag/vue-toastification'
import dayjs from 'dayjs'
import { debounce } from 'lodash'

const toast = useToast()
const loading = ref(false)
const appointments = ref<Appointment[]>([])
const search = ref('')
const statusFilter = ref('')
const dateFilter = ref('')
const pagination = ref({
  currentPage: 1,
  pageSize: 20,
  totalCount: 0,
})

const totalPages = computed(() => {
  return Math.ceil(pagination.value.totalCount / pagination.value.pageSize)
})

const formatDate = (date: string) => {
  return dayjs(date).format('DD/MM/YYYY')
}

const formatTime = (time: string) => {
  if (!time) return ''
  return dayjs(`2000-01-01 ${time}`).format('HH:mm')
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

const fetchAppointments = async () => {
  loading.value = true
  try {
    const params: any = {
      page: pagination.value.currentPage,
      pageSize: pagination.value.pageSize,
    }
    if (search.value) params.search = search.value
    if (statusFilter.value) params.status = statusFilter.value
    if (dateFilter.value) params.date = dateFilter.value

    const response = await adminAppointmentApi.getAll(params)
    if (response.data.success) {
      appointments.value = response.data.data.data
      pagination.value.totalCount = response.data.data.pagination.totalCount
    }
  } catch (error) {
    toast.error('Không thể tải danh sách lịch hẹn')
  } finally {
    loading.value = false
  }
}

const updateStatus = async (id: number, status: AppointmentStatus) => {
  if (!confirm(`Bạn có chắc muốn cập nhật trạng thái lịch hẹn thành ${getStatusText(status)}?`))
    return

  try {
    const response = await adminAppointmentApi.updateStatus(id, { status })
    if (response.data.success) {
      toast.success('Cập nhật trạng thái thành công')
      await fetchAppointments()
    }
  } catch (error) {
    toast.error('Cập nhật thất bại')
  }
}

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  pagination.value.currentPage = page
  fetchAppointments()
}

const onSearch = debounce(() => {
  pagination.value.currentPage = 1
  fetchAppointments()
}, 500)

onMounted(() => {
  fetchAppointments()
})
</script>

<style scoped>
.appointment-list {
  padding: 20px;
}
</style>
