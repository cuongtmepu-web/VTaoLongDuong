<template>
  <UserLayout>
    <div class="order-list">
      <h2 class="mb-4">Lịch sử thanh toán</h2>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
      </div>

      <div v-else-if="orders.length === 0" class="text-center py-5">
        <i class="bi bi-receipt display-1 text-muted"></i>
        <h4 class="mt-3">Chưa có đơn hàng</h4>
        <p class="text-muted">Bạn chưa có đơn hàng nào. Hãy đặt lịch khám để tạo đơn hàng.</p>
        <router-link to="/user/appointments/book" class="btn btn-primary">
          Đặt lịch ngay
        </router-link>
      </div>

      <div v-else>
        <div v-for="order in orders" :key="order.orderCode" class="order-card card mb-3">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-md-4">
                <h6 class="mb-1 text-primary">{{ order.orderCode }}</h6>
                <small class="text-muted">{{ formatDate(order.createdAt) }}</small>
              </div>
              <div class="col-md-3">
                <span :class="getStatusClass(order.paymentStatus)" class="badge">
                  {{ getStatusText(order.paymentStatus) }}
                </span>
              </div>
              <div class="col-md-3 text-end">
                <span class="fw-bold text-primary">{{ formatCurrency(order.finalAmount) }}</span>
              </div>
              <div class="col-md-2 text-end">
                <router-link
                  :to="`/user/orders/${order.orderId}`"
                  class="btn btn-outline-primary btn-sm"
                >
                  Chi tiết
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UserLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UserLayout from '@/layouts/UserLayout.vue'
import { paymentApi } from '@/api/payment'
import type { Order } from '@/api/types/payment'
import { useToast } from '@erag/vue-toastification'
import dayjs from 'dayjs'

const toast = useToast()
const loading = ref(false)
const orders = ref<Order[]>([])

const formatDate = (date: string) => {
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    Pending: 'bg-warning',
    Paid: 'bg-success',
    Failed: 'bg-danger',
    Refunded: 'bg-info',
  }
  return classes[status] || 'bg-secondary'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    Pending: 'Chờ thanh toán',
    Paid: 'Đã thanh toán',
    Failed: 'Thất bại',
    Refunded: 'Đã hoàn',
  }
  return texts[status] || status
}

const fetchOrders = async () => {
  loading.value = true
  try {
    // TODO: Implement API call when backend is ready
    // const response = await paymentApi.getUserOrders()
    // if (response.data.success) {
    //   orders.value = response.data.data
    // }

    // Mock data for testing
    orders.value = [
      {
        orderId: 1,
        orderCode: 'TLD202412050001',
        userId: 1,
        orderType: 'Consultation',
        totalAmount: 50000,
        discountAmount: 0,
        finalAmount: 50000,
        paymentStatus: 'Paid',
        orderStatus: 'Completed',
        paymentDate: '2024-12-05T10:30:00',
        transactionId: 'VNPAY123456',
        createdAt: '2024-12-05T10:25:00',
      },
      {
        orderId: 2,
        orderCode: 'TLD202412040002',
        userId: 1,
        orderType: 'Consultation',
        totalAmount: 50000,
        discountAmount: 0,
        finalAmount: 50000,
        paymentStatus: 'Pending',
        orderStatus: 'New',
        createdAt: '2024-12-04T15:20:00',
      },
    ]
  } catch (error) {
    toast.error('Không thể tải danh sách đơn hàng')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.order-list {
  padding: 20px;
}

.order-card {
  transition: transform 0.2s;
}

.order-card:hover {
  transform: translateX(5px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
