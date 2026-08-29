<template>
  <DefaultLayout>
    <div class="contact-page py-5">
      <div class="container">
        <h2 class="text-center mb-4">Liên hệ với chúng tôi</h2>
        <p class="text-center text-muted mb-5">Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn</p>

        <div class="row g-4">
          <div class="col-lg-5">
            <div class="contact-info-card">
              <h4>Thông tin liên hệ</h4>
              <div class="contact-item">
                <i class="bi bi-geo-alt"></i>
                <div>
                  <h6>Địa chỉ</h6>
                  <p>Số 123, Đường ABC, Quận XYZ, TP.HCM</p>
                </div>
              </div>
              <div class="contact-item">
                <i class="bi bi-phone"></i>
                <div>
                  <h6>Điện thoại</h6>
                  <p>0987 654 321</p>
                </div>
              </div>
              <div class="contact-item">
                <i class="bi bi-envelope"></i>
                <div>
                  <h6>Email</h6>
                  <p>contact@taolongduong.com</p>
                </div>
              </div>
              <div class="contact-item">
                <i class="bi bi-clock"></i>
                <div>
                  <h6>Giờ làm việc</h6>
                  <p>Thứ 2 - Thứ 6: 8:00 - 20:00</p>
                  <p>Thứ 7: 8:00 - 17:00</p>
                  <p>Chủ nhật: Nghỉ</p>
                </div>
              </div>

              <div class="social-links mt-4">
                <a href="#" class="social-link"><i class="bi bi-facebook"></i></a>
                <a href="#" class="social-link"><i class="bi bi-youtube"></i></a>
                <a href="#" class="social-link"><i class="bi bi-zalo"></i></a>
                <a href="#" class="social-link"><i class="bi bi-tiktok"></i></a>
              </div>
            </div>
          </div>

          <div class="col-lg-7">
            <div class="card shadow">
              <div class="card-body p-4">
                <h4 class="mb-3">Gửi tin nhắn</h4>
                <form @submit.prevent="handleSubmit">
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Họ và tên *</label>
                      <input type="text" class="form-control" v-model="form.fullName" required />
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Email *</label>
                      <input type="email" class="form-control" v-model="form.email" required />
                    </div>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Số điện thoại</label>
                    <input type="tel" class="form-control" v-model="form.phone" />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Chủ đề</label>
                    <select class="form-select" v-model="form.subject">
                      <option value="">Chọn chủ đề</option>
                      <option value="tu-van">Tư vấn sức khỏe</option>
                      <option value="dat-lich">Đặt lịch hẹn</option>
                      <option value="phan-hoi">Phản hồi</option>
                      <option value="khac">Khác</option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Nội dung *</label>
                    <textarea
                      class="form-control"
                      v-model="form.message"
                      rows="5"
                      required
                    ></textarea>
                  </div>
                  <button type="submit" class="btn btn-primary w-100" :disabled="submitting">
                    <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                    Gửi tin nhắn
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- Map -->
        <div class="mt-5">
          <div class="map-wrapper">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.123456!2d106.700000!3d10.800000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175290000000000%3A0x0000000000000000!2zTmjDoCB2xINuIFThuqVvIExvbmcgxJBhbmcgLSBQaMOybmcga8OhbSDEkMO0bmcgeQ!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
              width="100%"
              height="350"
              style="border: 0; border-radius: 12px"
              allowfullscreen="true"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useToast } from '@erag/vue-toastification'

const toast = useToast()
const submitting = ref(false)

const form = reactive({
  fullName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
})

const handleSubmit = async () => {
  submitting.value = true
  await new Promise((resolve) => setTimeout(resolve, 1500))
  toast.success('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.')
  form.fullName = ''
  form.email = ''
  form.phone = ''
  form.subject = ''
  form.message = ''
  submitting.value = false
}
</script>

<style scoped>
.contact-page {
  background: #f8f9fa;
  min-height: 100vh;
}

.contact-info-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
}

.contact-item {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.contact-item i {
  font-size: 1.5rem;
  color: #2c3e50;
  width: 40px;
  height: 40px;
  background: #f8f9fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.contact-item h6 {
  margin: 0;
  font-weight: 600;
}

.contact-item p {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.social-links {
  display: flex;
  gap: 10px;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f8f9fa;
  color: #2c3e50;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  text-decoration: none;
}

.social-link:hover {
  background: #2c3e50;
  color: white;
  transform: translateY(-3px);
}
</style>
