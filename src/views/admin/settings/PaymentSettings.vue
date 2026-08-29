<template>
  <AdminLayout>
    <div class="payment-settings">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Cài đặt cổng thanh toán</h2>
        <button class="btn btn-primary" @click="saveSettings" :disabled="saving">
          <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
          <i class="bi bi-save"></i> Lưu cài đặt
        </button>
      </div>

      <div class="row">
        <div class="col-lg-8">
          <!-- VNPay Settings -->
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="bi bi-credit-card me-2"></i>
                VNPay
              </h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <label class="form-label">Tmn Code</label>
                <input type="text" class="form-control" v-model="vnpay.tmnCode" />
                <small class="text-muted">Mã website tại VNPay</small>
              </div>

              <div class="mb-3">
                <label class="form-label">Hash Secret</label>
                <input type="password" class="form-control" v-model="vnpay.hashSecret" />
                <small class="text-muted">Chuỗi bí mật được cấp bởi VNPay</small>
              </div>

              <div class="mb-3">
                <label class="form-label">Base URL</label>
                <input type="text" class="form-control" v-model="vnpay.baseUrl" />
                <small class="text-muted"
                  >https://sandbox.vnpayment.vn/paymentv2/vpcpay.html (Sandbox)</small
                >
              </div>

              <div class="mb-3">
                <label class="form-label">Return URL</label>
                <input type="text" class="form-control" v-model="vnpay.returnUrl" />
                <small class="text-muted">URL callback sau khi thanh toán</small>
              </div>
            </div>
          </div>

          <!-- MoMo Settings -->
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="bi bi-phone me-2"></i>
                MoMo
              </h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <label class="form-label">Partner Code</label>
                <input type="text" class="form-control" v-model="momo.partnerCode" />
              </div>

              <div class="mb-3">
                <label class="form-label">Access Key</label>
                <input type="text" class="form-control" v-model="momo.accessKey" />
              </div>

              <div class="mb-3">
                <label class="form-label">Secret Key</label>
                <input type="password" class="form-control" v-model="momo.secretKey" />
              </div>

              <div class="mb-3">
                <label class="form-label">Endpoint</label>
                <input type="text" class="form-control" v-model="momo.endpoint" />
                <small class="text-muted">https://test-payment.momo.vn/v2/gateway/api/create</small>
              </div>

              <div class="mb-3">
                <label class="form-label">Return URL</label>
                <input type="text" class="form-control" v-model="momo.returnUrl" />
              </div>
            </div>
          </div>

          <div class="alert alert-warning mt-3">
            <i class="bi bi-exclamation-triangle"></i>
            <strong>Lưu ý:</strong> Các thông tin này là nhạy cảm. Vui lòng bảo mật và chỉ nhập khi
            thực sự cần thiết.
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Hướng dẫn</h5>
            </div>
            <div class="card-body">
              <h6>VNPay</h6>
              <ul class="text-muted small">
                <li class="mb-2">
                  Đăng ký tài khoản tại <a href="https://vnpay.vn" target="_blank">vnpay.vn</a>
                </li>
                <li class="mb-2">Lấy Tmn Code và Hash Secret từ Merchant Portal</li>
                <li>Test với sandbox trước khi chuyển sang production</li>
              </ul>

              <hr />

              <h6>MoMo</h6>
              <ul class="text-muted small">
                <li class="mb-2">
                  Đăng ký tài khoản tại <a href="https://momo.vn" target="_blank">momo.vn</a>
                </li>
                <li class="mb-2">Lấy Partner Code, Access Key, Secret Key</li>
                <li>Test với môi trường sandbox</li>
              </ul>

              <hr />

              <div class="alert alert-info small">
                <i class="bi bi-info-circle"></i>
                Sau khi thay đổi cấu hình, hãy test với một đơn hàng nhỏ để đảm bảo hoạt động.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { systemSettingsApi } from '@/api/admin/systemSettings'
import { useToast } from '@erag/vue-toastification'

const toast = useToast()
const saving = ref(false)

const vnpay = reactive({
  tmnCode: '',
  hashSecret: '',
  baseUrl: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  returnUrl: '',
})

const momo = reactive({
  partnerCode: '',
  accessKey: '',
  secretKey: '',
  endpoint: 'https://test-payment.momo.vn/v2/gateway/api/create',
  returnUrl: '',
})

const fetchSettings = async () => {
  try {
    const response = await systemSettingsApi.getGroup('Payment')
    if (response.data.success) {
      const data = response.data.data

      vnpay.tmnCode = data.find((s) => s.settingKey === 'VNPay_TmnCode')?.settingValue || ''
      vnpay.hashSecret = data.find((s) => s.settingKey === 'VNPay_HashSecret')?.settingValue || ''
      vnpay.baseUrl =
        data.find((s) => s.settingKey === 'VNPay_BaseUrl')?.settingValue ||
        'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
      vnpay.returnUrl = data.find((s) => s.settingKey === 'VNPay_ReturnUrl')?.settingValue || ''

      momo.partnerCode = data.find((s) => s.settingKey === 'MoMo_PartnerCode')?.settingValue || ''
      momo.accessKey = data.find((s) => s.settingKey === 'MoMo_AccessKey')?.settingValue || ''
      momo.secretKey = data.find((s) => s.settingKey === 'MoMo_SecretKey')?.settingValue || ''
      momo.endpoint =
        data.find((s) => s.settingKey === 'MoMo_Endpoint')?.settingValue ||
        'https://test-payment.momo.vn/v2/gateway/api/create'
      momo.returnUrl = data.find((s) => s.settingKey === 'MoMo_ReturnUrl')?.settingValue || ''
    }
  } catch (error) {
    toast.error('Không thể tải cài đặt')
  }
}

const saveSettings = async () => {
  saving.value = true
  try {
    const data = [
      { key: 'VNPay_TmnCode', value: vnpay.tmnCode },
      { key: 'VNPay_HashSecret', value: vnpay.hashSecret },
      { key: 'VNPay_BaseUrl', value: vnpay.baseUrl },
      { key: 'VNPay_ReturnUrl', value: vnpay.returnUrl },
      { key: 'MoMo_PartnerCode', value: momo.partnerCode },
      { key: 'MoMo_AccessKey', value: momo.accessKey },
      { key: 'MoMo_SecretKey', value: momo.secretKey },
      { key: 'MoMo_Endpoint', value: momo.endpoint },
      { key: 'MoMo_ReturnUrl', value: momo.returnUrl },
    ]

    const response = await systemSettingsApi.updateGroup(data)
    if (response.data.success) {
      toast.success('Lưu cài đặt thành công!')
    }
  } catch (error) {
    toast.error('Lưu cài đặt thất bại')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchSettings()
})
</script>

<style scoped>
.payment-settings {
  padding: 20px;
}
</style>
