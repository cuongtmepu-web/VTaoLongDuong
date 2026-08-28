export type PaymentMethod = 'VNPay' | 'Momo' | 'BankTransfer' | 'Cash'
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded'
export type OrderType = 'Consultation' | 'Medicine' | 'Package'
export type OrderStatus = 'New' | 'Processing' | 'Completed' | 'Cancelled'

export interface Order {
  orderId: number
  orderCode: string
  userId: number
  orderType: OrderType
  relatedId?: number
  totalAmount: number
  discountAmount: number
  finalAmount: number
  paymentMethod?: PaymentMethod
  paymentStatus: PaymentStatus
  orderStatus: OrderStatus
  paymentDate?: string
  transactionId?: string
  notes?: string
  createdAt: string
  updatedAt?: string
  user?: {
    userId: number
    fullName: string
    email: string
    phone: string
  }
}

export interface CreatePaymentRequest {
  appointmentId?: number
  medicalRecordId?: number
  paymentMethod: PaymentMethod
  returnUrl?: string
}

export interface PaymentResponse {
  orderCode: string
  amount: number
  paymentUrl: string
  method: PaymentMethod
}

export interface PaymentCallbackData {
  orderCode: string
  transactionId: string
  paymentStatus: string
  responseCode?: string
  message?: string
}
