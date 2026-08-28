<template>
  <section class="contact-section py-5">
    <div class="container">
      <div class="row g-4">
        <div class="col-lg-5">
          <h2 class="section-title mb-4">
            {{ sectionData.title || 'Liên hệ với chúng tôi' }}
          </h2>
          <p class="text-muted mb-4">
            {{
              sectionData.description ||
              'Hãy liên hệ với chúng tôi để được tư vấn và hỗ trợ tốt nhất'
            }}
          </p>

          <div class="contact-info">
            <div class="info-item d-flex align-items-start gap-3 mb-3">
              <div class="info-icon">
                <i class="bi bi-geo-alt"></i>
              </div>
              <div>
                <h6 class="mb-0">Địa chỉ</h6>
                <p class="text-muted small">
                  {{ sectionData.address || 'Số 123, Đường ABC, Quận XYZ, TP.HCM' }}
                </p>
              </div>
            </div>

            <div class="info-item d-flex align-items-start gap-3 mb-3">
              <div class="info-icon">
                <i class="bi bi-phone"></i>
              </div>
              <div>
                <h6 class="mb-0">Điện thoại</h6>
                <p class="text-muted small">{{ sectionData.phone || '0987 654 321' }}</p>
              </div>
            </div>

            <div class="info-item d-flex align-items-start gap-3 mb-3">
              <div class="info-icon">
                <i class="bi bi-envelope"></i>
              </div>
              <div>
                <h6 class="mb-0">Email</h6>
                <p class="text-muted small">
                  {{ sectionData.email || 'contact@taolongduong.com' }}
                </p>
              </div>
            </div>

            <div class="info-item d-flex align-items-start gap-3">
              <div class="info-icon">
                <i class="bi bi-clock"></i>
              </div>
              <div>
                <h6 class="mb-0">Giờ làm việc</h6>
                <p class="text-muted small">
                  Thứ 2 - Thứ 6: 8:00 - 20:00<br />
                  Thứ 7: 8:00 - 17:00<br />
                  Chủ nhật: Nghỉ
                </p>
              </div>
            </div>
          </div>

          <div class="social-links mt-4">
            <a href="#" class="social-link"><i class="bi bi-facebook"></i></a>
            <a href="#" class="social-link"><i class="bi bi-youtube"></i></a>
            <a href="#" class="social-link"><i class="bi bi-zalo"></i></a>
            <a href="#" class="social-link"><i class="bi bi-tiktok"></i></a>
          </div>
        </div>

        <div class="col-lg-7">
          <div class="contact-form-wrapper">
            <div class="card shadow">
              <div class="card-body p-4">
                <h5 class="mb-3">Gửi tin nhắn cho chúng tôi</h5>

                <form @submit.prevent="handleSubmit">
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Họ và tên *</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="form.fullName"
                        required
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Email *</label>
                      <input
                        type="email"
                        class="form-control"
                        v-model="form.email"
                        required
                        placeholder="Nhập email"
                      />
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Số điện thoại</label>
                    <input
                      type="tel"
                      class="form-control"
                      v-model="form.phone"
                      placeholder="Nhập số điện thoại"
                    />
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
                      rows="4"
                      required
                      placeholder="Nhập nội dung tin nhắn"
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
      </div>

      <!-- Google Maps -->
      <div class="mt-5">
        <div class="map-wrapper">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.123456!2d106.700000!3d10.800000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175290000000000%3A0x0000000000000000!2zTmjDoCB2xINuIFThuqVvIExvbmcgxJBhbmcgLSBQaMOybmcga8OhbSDEkMO0bmcgeQ!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
            width="100%"
            height="300"
            style="border: 0; border-radius: 12px"
            allowfullscreen="true"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          >
          </iframe>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useLandingStore } from '@/api/stores/landing'
import { useToast } from '@erag/vue-toastification'

const landingStore = useLandingStore()
const toast = useToast()
const submitting = ref(false)

const sectionData = computed(() => landingStore.getSection('contact'))

const form = reactive({
  fullName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
})

const handleSubmit = async () => {
  submitting.value = true

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500))

  toast.success('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.')

  // Reset form
  form.fullName = ''
  form.email = ''
  form.phone = ''
  form.subject = ''
  form.message = ''

  submitting.value = false
}
</script>

<style scoped>
.contact-section {
  background: white;
}

.section-title {
  font-size: 2.5rem;
  font-weight: bold;
}

.contact-info .info-icon {
  width: 40px;
  height: 40px;
  background: #f8f9fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2c3e50;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.contact-info h6 {
  font-weight: 600;
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

.contact-form-wrapper .card {
  border: none;
}

.contact-form-wrapper .card-body {
  background: #f8f9fa;
}

.map-wrapper iframe {
  width: 100%;
  height: 300px;
  border-radius: 12px;
}
</style>
