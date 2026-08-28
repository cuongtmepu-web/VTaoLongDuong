export interface Doctor {
  doctorId: number
  userId: number
  fullName: string
  specialization?: string
  yearsOfExperience: number
  biography?: string
  consultationFee: number
  isAvailable: boolean
  avatarUrl?: string
  email?: string
  phone?: string
  address?: string
  scheduleJson?: string
}

export interface DoctorListResponse {
  doctorId: number
  userId: number
  fullName: string
  specialization?: string
  yearsOfExperience: number
  consultationFee: number
  isAvailable: boolean
  avatarUrl?: string
  totalAppointments: number
  completedAppointments: number
}

export interface DoctorSchedule {
  [day: string]: string[]
}

export interface CreateDoctorRequest {
  userId: number
  specialization?: string
  yearsOfExperience: number
  biography?: string
  consultationFee: number
  isAvailable: boolean
  scheduleJson?: string
}

export interface UpdateDoctorRequest {
  specialization?: string
  yearsOfExperience?: number
  biography?: string
  consultationFee?: number
  isAvailable?: boolean
  scheduleJson?: string
}
