<template>
  <AdminLayout>
    <div class="order-detail">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Chi tiết đơn hàng</h2>
        <router-link to="/admin/orders" class="btn btn-secondary">
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
                <span :class="getPaymentStatusClass(order.paymentStatus)" class="badge fs-6">
                  {{ getPaymentStatusText(order.paymentStatus) }}
                </span>
              </div>

              <hr />

              <div class="order-info">
                <div class="row g-4">
                  <div class="col-md-6">
                    <div class="info-item">
                      <label class="text-muted">Người dùng</label>
                      <p class="fw-bold">{{ order.user?.fullName || 'N/A' }}</p>
                      <p class="text-muted small">{{ order.user?.email }}</p>
                      <p class="text-muted small">{{ order.user?.phone }}</p>
                    </div>
                  </div>
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
                  <div class="col-md-6">
                    <div class="info-item">
                      <label class="text-muted">Trạng thái đơn hàng</label>
                      <p class="fw-bold">{{ getOrderStatusText(order.orderStatus) }}</p>
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

              <div class="mt-4" v-if="order.notes">
                <h6>Ghi chú</h6>
                <p class="text-muted">{{ order.notes }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Cập nhật trạng thái</h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <label class="form-label">Trạng thái thanh toán</label>
                <select class="form-select" v-model="updateData.paymentStatus">
                  <option value="Pending">Chờ thanh toán</option>
                  <option value="Paid">Đã thanh toán</option>
                  <option value="Failed">Thất bại</option>
                  <option value="Refunded">Đã hoàn</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Trạng thái đơn hàng</label>
                <select class="form-select" v-model="updateData.orderStatus">
                  <option value="New">Mới</option>
                  <option value="Processing">Đang xử lý</option>
                  <option value="Completed">Hoàn thành</option>
                  <option value="Cancelled">Đã hủy</option>
                </select>
              </div>
              <button class="btn btn-primary w-100" @click="updateOrder" :disabled="updating">
                <span v-if="updating" class="spinner-border spinner-border-sm me-2"></span>
                Cập nhật trạng thái
              </button>
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
        <router-link to="/admin/orders" class="btn btn-primary mt-3">Quay lại</router-link>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { orderApi } from '@/api/admin/order'
import type { Order } from '@/api/types/payment'
import { useToast } from '@erag/vue-toastification'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const loading = ref(false)
const updating = ref(false)
const order = ref<Order | null>(null)

const updateData = reactive({
  paymentStatus: '',
  orderStatus: '',
})

const formatDate = (date: string) => {
  if (!date) return ''
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

const getOrderTypeText = (type: string) => {
  const texts: Record<string, string> = {
    Consultation: 'Tư vấn',
    Medicine: 'Thuốc',
    Package: 'Gói dịch vụ',
  }
  return texts[type] || type
}

const getPaymentStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    Pending: 'bg-warning',
    Paid: 'bg-success',
    Failed: 'bg-danger',
    Refunded: 'bg-info',
  }
  return classes[status] || 'bg-secondary'
}

const getPaymentStatusText = (status: string) => {
  const texts: Record<string, string> = {
    Pending: 'Chờ thanh toán',
    Paid: 'Đã thanh toán',
    Failed: 'Thất bại',
    Refunded: 'Đã hoàn',
  }
  return texts[status] || status
}

const getOrderStatusText = (status: string) => {
  const texts: Record<string, string> = {
    New: 'Mới',
    Processing: 'Đang xử lý',
    Completed: 'Hoàn thành',
    Cancelled: 'Đã hủy',
  }
  return texts[status] || status
}

const fetchOrder = async () => {
  const id = route.params.id as string
  if (!id) return

  loading.value = true
  try {
    const response = await orderApi.getById(parseInt(id))
    if (response.data.success) {
      order.value = response.data.data
      updateData.paymentStatus = order.value.paymentStatus
      updateData.orderStatus = order.value.orderStatus
    }
  } catch (error) {
    toast.error('Không thể tải thông tin đơn hàng')
    router.push('/admin/orders')
  } finally {
    loading.value = false
  }
}

const updateOrder = async () => {
  if (!order.value) return

  updating.value = true
  try {
    const response = await orderApi.updateStatus(order.value.orderId, {
      paymentStatus: updateData.paymentStatus,
      orderStatus: updateData.orderStatus,
    })
    if (response.data.success) {
      toast.success('Cập nhật trạng thái thành công')
      await fetchOrder()
    }
  } catch (error) {
    toast.error('Cập nhật thất bại')
  } finally {
    updating.value = false
  }
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
</style>
