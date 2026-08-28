import { defineStore } from 'pinia'
import { appointmentApi } from '@/api/appointment'
import { type Appointment, type BookAppointmentRequest } from '@/api/types/appointment'
import { useToast } from '@erag/vue-toastification'

const toast = useToast()

interface AppointmentState {
  appointments: Appointment[]
  currentAppointment: Appointment | null
  loading: boolean
}

export const useAppointmentStore = defineStore('appointment', {
  state: (): AppointmentState => ({
    appointments: [],
    currentAppointment: null,
    loading: false,
  }),

  getters: {
    pendingAppointments: (state) => state.appointments.filter((a) => a.status === 'Pending'),
    confirmedAppointments: (state) => state.appointments.filter((a) => a.status === 'Confirmed'),
    completedAppointments: (state) => state.appointments.filter((a) => a.status === 'Completed'),
    cancelledAppointments: (state) => state.appointments.filter((a) => a.status === 'Cancelled'),
  },

  actions: {
    async fetchAppointments(): Promise<void> {
      this.loading = true
      try {
        const response = await appointmentApi.getAll()
        if (response.data.success) {
          this.appointments = response.data.data
        }
      } catch (error: any) {
        toast.error('Không thể tải danh sách lịch hẹn')
      } finally {
        this.loading = false
      }
    },

    async fetchAppointmentById(id: number): Promise<void> {
      this.loading = true
      try {
        const response = await appointmentApi.getById(id)
        if (response.data.success) {
          this.currentAppointment = response.data.data
        }
      } catch (error: any) {
        toast.error('Không thể tải thông tin lịch hẹn')
      } finally {
        this.loading = false
      }
    },

    async bookAppointment(data: BookAppointmentRequest): Promise<boolean> {
      try {
        const response = await appointmentApi.create(data)
        if (response.data.success) {
          toast.success('Đặt lịch hẹn thành công!')
          await this.fetchAppointments()
          return true
        }
        return false
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Đặt lịch thất bại')
        return false
      }
    },

    async cancelAppointment(id: number, reason?: string): Promise<boolean> {
      try {
        const response = await appointmentApi.cancel(id, reason)
        if (response.data.success) {
          toast.success('Hủy lịch hẹn thành công')
          await this.fetchAppointments()
          return true
        }
        return false
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Hủy lịch thất bại')
        return false
      }
    },
  },
})
