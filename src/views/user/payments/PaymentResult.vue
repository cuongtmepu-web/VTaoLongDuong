<template>
  <UserLayout>
    <div class="payment-result">
      <div class="row justify-content-center">
        <div class="col-lg-6">
          <div class="card text-center">
            <div class="card-body p-5">
              <div v-if="loading" class="py-5">
                <div class="spinner-border text-primary"></div>
                <p class="mt-3">Đang xác nhận thanh toán...</p>
              </div>

              <div v-else-if="success">
                <div class="payment-icon success">
                  <i class="bi bi-check-circle-fill"></i>
                </div>
                <h3 class="mt-3 text-success">Thanh toán thành công!</h3>
                <p class="text-muted">Đơn hàng của bạn đã được thanh toán thành công.</p>

                <div class="payment-info bg-light p-3 rounded my-4">
                  <p class="mb-1"><strong>Mã đơn hàng:</strong> {{ orderCode }}</p>
                  <p class="mb-0"><strong>Số tiền:</strong> {{ formatCurrency(amount) }}</p>
                </div>

                <div class="d-grid gap-2">
                  <router-link to="/user/orders" class="btn btn-primary">
                    <i class="bi bi-receipt"></i> Xem đơn hàng
                  </router-link>
                  <router-link to="/" class="btn btn-outline-secondary">
                    <i class="bi bi-house"></i> Về trang chủ
                  </router-link>
                </div>
              </div>

              <div v-else>
                <div class="payment-icon failed">
                  <i class="bi bi-x-circle-fill"></i>
                </div>
                <h3 class="mt-3 text-danger">Thanh toán thất bại!</h3>
                <p class="text-muted">
                  {{ errorMessage || 'Đã có lỗi xảy ra trong quá trình thanh toán.' }}
                </p>

                <div class="d-grid gap-2 mt-4">
                  <button class="btn btn-warning" @click="retryPayment">
                    <i class="bi bi-arrow-repeat"></i> Thử lại
                  </button>
                  <router-link to="/user/orders" class="btn btn-outline-secondary">
                    <i class="bi bi-receipt"></i> Xem đơn hàng
                  </router-link>
                </div>
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
import { useRoute, useRouter } from 'vue-router'
import UserLayout from '@/layouts/UserLayout.vue'
import { paymentApi } from '@/api/payment'
import { useToast } from '@erag/vue-toastification'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const loading = ref(true)
const success = ref(false)
const orderCode = ref('')
const amount = ref(0)
const errorMessage = ref('')

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

const checkPaymentStatus = async () => {
  const code = route.query.orderCode as string
  const status = route.query.status as string

  if (!code) {
    loading.value = false
    success.value = false
    errorMessage.value = 'Không tìm thấy thông tin đơn hàng'
    return
  }

  orderCode.value = code

  try {
    // If status is returned from callback
    if (status) {
      if (status === 'success' || status === 'PAID') {
        success.value = true
        amount.value = parseInt((route.query.amount as string) || '0')
      } else {
        success.value = false
        errorMessage.value = (route.query.message as string) || 'Thanh toán không thành công'
      }
      loading.value = false
      return
    }

    // Otherwise, check status from API
    const response = await paymentApi.getStatus(code)
    if (response.data.success) {
      const data = response.data.data
      if (data.paymentStatus === 'Paid') {
        success.value = true
        amount.value = data.finalAmount
      } else {
        success.value = false
        errorMessage.value = 'Thanh toán chưa hoàn tất'
      }
    } else {
      success.value = false
      errorMessage.value = 'Không thể kiểm tra trạng thái thanh toán'
    }
  } catch (error) {
    success.value = false
    errorMessage.value = 'Đã có lỗi xảy ra'
    toast.error('Không thể kiểm tra trạng thái thanh toán')
  } finally {
    loading.value = false
  }
}

const retryPayment = () => {
  router.push('/user/orders')
}

onMounted(() => {
  checkPaymentStatus()
})
</script>

<style scoped>
.payment-result {
  padding: 40px 20px;
  min-height: 80vh;
  background: #f8f9fa;
}

.payment-icon {
  font-size: 5rem;
}

.payment-icon.success {
  color: #28a745;
}

.payment-icon.failed {
  color: #dc3545;
}

.payment-info {
  background: #f8f9fa;
  border-radius: 8px;
}

.payment-info p {
  margin: 0;
}
</style>
