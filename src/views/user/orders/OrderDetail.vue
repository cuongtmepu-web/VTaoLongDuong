<template>
  <UserLayout>
    <div class="order-detail">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Chi tiết đơn hàng</h2>
        <router-link to="/user/orders" class="btn btn-secondary">
          <i class="bi bi-arrow-left"></i> Quay lại
        </router-link>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
      </div>

      <div v-else-if="order" class="row">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h4>Đơn hàng #{{ order.orderCode }}</h4>
                  <p class="text-muted small">{{ formatDate(order.createdAt) }}</p>
                </div>
                <span :class="getStatusClass(order.paymentStatus)" class="badge fs-6">
                  {{ getStatusText(order.paymentStatus) }}
                </span>
              </div>

              <hr />

              <div class="order-info">
                <div class="row g-4">
                  <div class="col-md-6">
                    <div class="info-item">
                      <label class="text-muted">Loại đơn hàng</label>
                      <p class="fw-bold">{{ getOrderTypeText(order.orderType) }}</p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="info-item">
                      <label class="text-muted">Phương thức thanh toán</label>
                      <p class="fw-bold">{{ order.paymentMethod || 'Chưa cập nhật' }}</p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="info-item">
                      <label class="text-muted">Mã giao dịch</label>
                      <p class="fw-bold">{{ order.transactionId || 'Chưa có' }}</p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="info-item">
                      <label class="text-muted">Ngày thanh toán</label>
                      <p class="fw-bold">
                        {{ order.paymentDate ? formatDate(order.paymentDate) : 'Chưa thanh toán' }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <hr />

              <div class="order-summary">
                <h5>Chi tiết thanh toán</h5>
                <div class="summary-item d-flex justify-content-between">
                  <span>Tổng tiền</span>
                  <span>{{ formatCurrency(order.totalAmount) }}</span>
                </div>
                <div
                  class="summary-item d-flex justify-content-between"
                  v-if="order.discountAmount > 0"
                >
                  <span>Giảm giá</span>
                  <span class="text-danger">-{{ formatCurrency(order.discountAmount) }}</span>
                </div>
                <div class="summary-item d-flex justify-content-between fw-bold fs-5">
                  <span>Thành tiền</span>
                  <span class="text-primary">{{ formatCurrency(order.finalAmount) }}</span>
                </div>
              </div>

              <div class="mt-4" v-if="order.paymentStatus === 'Pending'">
                <button class="btn btn-primary w-100" @click="payOrder">
                  <i class="bi bi-credit-card"></i> Thanh toán ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Trạng thái đơn hàng</h5>
            </div>
            <div class="card-body">
              <div class="status-timeline">
                <div class="status-item" :class="{ active: order.orderStatus !== 'New' }">
                  <div class="status-dot"></div>
                  <div>
                    <h6>Đã tạo</h6>
                    <small class="text-muted">{{ formatDate(order.createdAt) }}</small>
                  </div>
                </div>
                <div
                  class="status-item"
                  :class="{
                    active: order.orderStatus === 'Processing' || order.orderStatus === 'Completed',
                  }"
                >
                  <div class="status-dot"></div>
                  <div>
                    <h6>Đang xử lý</h6>
                    <small class="text-muted">{{
                      order.paymentDate ? formatDate(order.paymentDate) : 'Đang chờ'
                    }}</small>
                  </div>
                </div>
                <div class="status-item" :class="{ active: order.orderStatus === 'Completed' }">
                  <div class="status-dot"></div>
                  <div>
                    <h6>Hoàn thành</h6>
                    <small class="text-muted">{{
                      order.paymentDate ? formatDate(order.paymentDate) : 'Chưa hoàn thành'
                    }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card mt-3" v-if="order.paymentStatus === 'Paid'">
            <div class="card-body text-center">
              <i class="bi bi-check-circle-fill text-success display-4"></i>
              <h5 class="mt-2">Đã thanh toán</h5>
              <p class="text-muted small">Đơn hàng đã được thanh toán thành công</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-5">
        <i class="bi bi-receipt-cutoff display-1 text-muted"></i>
        <h4 class="mt-3">Không tìm thấy đơn hàng</h4>
        <router-link to="/user/orders" class="btn btn-primary mt-3">
          Quay lại danh sách
        </router-link>
      </div>
    </div>
  </UserLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UserLayout from '@/layouts/UserLayout.vue'
import { paymentApi } from '@/api/payment'
import type { Order } from '@/api/types/payment'
import { useToast } from '@erag/vue-toastification'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const loading = ref(false)
const order = ref<Order | null>(null)

const formatDate = (date: string) => {
  if (!date) return ''
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

const getOrderTypeText = (type: string) => {
  const texts: Record<string, string> = {
    Consultation: 'Tư vấn',
    Medicine: 'Thuốc',
    Package: 'Gói dịch vụ',
  }
  return texts[type] || type
}

const fetchOrder = async () => {
  const id = route.params.id as string
  if (!id) return

  loading.value = true
  try {
    // TODO: Implement API call when backend is ready
    // const response = await paymentApi.getOrderById(parseInt(id))
    // if (response.data.success) {
    //   order.value = response.data.data
    // }

    // Mock data for testing
    order.value = {
      orderId: parseInt(id),
      orderCode: 'TLD202412050001',
      userId: 1,
      orderType: 'Consultation',
      totalAmount: 50000,
      discountAmount: 0,
      finalAmount: 50000,
      paymentMethod: 'VNPay',
      paymentStatus: 'Paid',
      orderStatus: 'Completed',
      paymentDate: '2024-12-05T10:30:00',
      transactionId: 'VNPAY123456',
      createdAt: '2024-12-05T10:25:00',
    }
  } catch (error) {
    toast.error('Không thể tải thông tin đơn hàng')
    router.push('/user/orders')
  } finally {
    loading.value = false
  }
}

const payOrder = () => {
  toast.info('Chức năng đang được phát triển')
}

onMounted(() => {
  fetchOrder()
})
</script>

<style scoped>
.order-detail {
  padding: 20px;
}

.info-item {
  margin-bottom: 15px;
}

.info-item label {
  display: block;
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 2px;
}

.info-item p {
  margin: 0;
  font-size: 1rem;
}

.summary-item {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.summary-item:last-child {
  border-bottom: none;
}

.status-timeline {
  padding: 10px 0;
}

.status-item {
  display: flex;
  gap: 15px;
  padding: 10px 0;
  position: relative;
  opacity: 0.5;
}

.status-item.active {
  opacity: 1;
}

.status-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 8px;
  top: 40px;
  bottom: 0;
  width: 2px;
  background: #dee2e6;
}

.status-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #dee2e6;
  border: 3px solid #fff;
  box-shadow: 0 0 0 2px #dee2e6;
  flex-shrink: 0;
  margin-top: 2px;
}

.status-item.active .status-dot {
  background: #28a745;
  box-shadow: 0 0 0 2px #28a745;
}

.status-item h6 {
  margin: 0;
  font-size: 0.95rem;
}

.status-item small {
  font-size: 0.8rem;
}
</style>
