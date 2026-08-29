export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'NoShow'

export interface Appointment {
  appointmentId: number
  userId: number
  userName: string
  doctorId: number
  phone: string
  email: string
  doctorName: string
  appointmentDate: string
  appointmentTime: string
  duration: number
  status: AppointmentStatus
  statusName: string
  symptoms?: string
  notes?: string
  consultationFee: number
  createdAt: string
}

export interface BookAppointmentRequest {
  doctorId: number
  appointmentDate: string
  appointmentTime: string
  symptoms?: string
  notes?: string
}

export interface UpdateAppointmentStatusRequest {
  status: AppointmentStatus
  notes?: string
}
