import api from './axios'
import { type CreatePaymentRequest, type PaymentResponse, type Order } from './types/payment'
import { type ApiResponse } from './types/common'

export const paymentApi = {
  create: (data: CreatePaymentRequest) =>
    api.post<ApiResponse<PaymentResponse>>('/payment/create', data),

  getStatus: (orderCode: string) => api.get<ApiResponse<Order>>(`/payment/status/${orderCode}`),
}
