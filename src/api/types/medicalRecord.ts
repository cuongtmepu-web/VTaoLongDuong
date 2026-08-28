export interface Prescription {
  prescriptionId: number
  medicineName: string
  dosage?: string
  unit?: string
  quantity: number
  instructions?: string
  price?: number
  totalPrice?: number
}

export interface MedicalRecord {
  medicalRecordId: number
  userId: number
  userName: string
  doctorId: number
  doctorName: string
  recordDate: string
  diagnosis?: string
  symptoms?: string
  traditionalDiagnosis?: string
  treatmentPlan?: string
  prescriptionJson?: string
  followUpDate?: string
  prescriptions?: Prescription[]
}

export interface CreateMedicalRecordRequest {
  userId: number
  doctorId: number
  appointmentId?: number
  diagnosis?: string
  symptoms?: string
  traditionalDiagnosis?: string
  treatmentPlan?: string
  prescriptionJson?: string
  followUpDate?: string
  notes?: string
}

export interface CreatePrescriptionRequest {
  medicalRecordId: number
  medicineName: string
  dosage?: string
  unit?: string
  quantity: number
  instructions?: string
  price?: number
  totalPrice?: number
}
