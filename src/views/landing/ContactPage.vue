<template>
  <DefaultLayout>
    <div class="contact-page py-5">
      <div class="mist-layer"></div>
      <div class="container">
        <div class="page-header">
          <span class="eyebrow-tag">Kết nối</span>
          <h2 class="text-center mb-2">Liên hệ với chúng tôi</h2>
          <p class="text-center page-sub mb-3">Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn</p>
          <div class="section-divider">
            <span class="line"></span>
            <svg class="taiji-icon" viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" stroke-width="3" />
              <path
                d="M50,3 A23.5,23.5 0 0,1 50,50 A23.5,23.5 0 0,0 50,97 A47,47 0 0,1 50,3 Z"
                fill="currentColor"
              />
              <circle cx="50" cy="26.5" r="7" fill="var(--surface)" />
              <circle cx="50" cy="73.5" r="7" fill="currentColor" />
            </svg>
            <span class="line right"></span>
          </div>
        </div>

        <div class="page-detail">
          <div class="row g-4">
            <div class="col-lg-5">
              <div class="contact-info-card">
                <h4>Thông tin liên hệ</h4>
                <div class="contact-item">
                  <i class="bi bi-geo-alt"></i>
                  <div>
                    <h6>Địa chỉ</h6>
                    <p>Số 6, trại Hậu, TDP Đông Lương, Phường Việt Yên, Thành phố Bắc Ninh</p>
                  </div>
                </div>
                <div class="contact-item">
                  <i class="bi bi-phone"></i>
                  <div>
                    <h6>Điện thoại</h6>
                    <p>0364 145 761</p>
                  </div>
                </div>
                <div class="contact-item">
                  <i class="bi bi-envelope"></i>
                  <div>
                    <h6>Email</h6>
                    <p>cuongtm@taolongduong.com</p>
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
                  <a href="/" class="social-link"><i class="bi bi-facebook"></i></a>
                  <a href="/" class="social-link"><i class="bi bi-youtube"></i></a>
                  <a href="/" class="social-link"><i class="bi bi-instagram"></i></a>
                  <a href="/" class="social-link"><i class="bi bi-tiktok"></i></a>
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
                        <label class="form-label"
                          >Họ và tên <span style="color: red">*</span></label
                        >
                        <input type="text" class="form-control" v-model="form.fullName" required />
                      </div>
                      <div class="col-md-6 mb-3">
                        <label class="form-label">Email <span style="color: red">*</span></label>
                        <input type="email" class="form-control" v-model="form.email" required />
                      </div>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Số điện thoại </label>
                      <input type="tel" class="form-control" v-model="form.phone" />
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Chủ đề</label>
                      <BaseSelect
                        v-model="form.subject"
                        :options="[
                          { value: '', label: 'Chọn chủ đề' },
                          { value: 'tu-van', label: 'Tư vấn sức khỏe' },
                          { value: 'dat-lich', label: 'Đặt lịch hẹn' },
                          { value: 'phan-hoi', label: 'Phản hồi' },
                          { value: 'khac', label: 'Khác' },
                        ]"
                      />
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Nội dung <span style="color: red">*</span></label>
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
                src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d12505.711310427983!2d106.09500752664984!3d21.27264647408584!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2sus!4v1788761359425!5m2!1svi!2sus"
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
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
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
  position: relative;
  padding: 7rem 0 0 0;
  background: linear-gradient(180deg, var(--soft-green) 0%, var(--bg) 100%);
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 2.6rem;
}
.eyebrow-tag {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold);
}
.page-header h2 {
  font-family: var(--font-heading);
  font-size: clamp(2.2rem, 3.4vw, 3rem);
  color: var(--text);
  font-weight: 600;
}
.page-sub {
  color: var(--text-soft);
  font-size: 1rem;
}
.page-header .section-divider {
  margin-top: 0.6rem;
}

.contact-info-card {
  background: var(--surface);
  border-radius: 22px;
  padding: 2rem 1.8rem;
  border: 1px solid var(--surface-border);
  box-shadow: 0 12px 24px rgba(28, 38, 32, 0.04);
  height: 100%;
}
.contact-info-card h4 {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1.35rem;
  color: var(--text);
  margin-bottom: 1.4rem;
}

.contact-page .page-detail {
  width: 80%;
  margin: 0 auto;
  padding: 0;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.9rem 0;
  border-bottom: 1px solid var(--surface-border);
}
.contact-item:last-of-type {
  border-bottom: none;
}
.contact-item i {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--primary-light);
  color: var(--primary-dark);
  font-size: 1.1rem;
}
.contact-item h6 {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--gold);
  margin-bottom: 0.2rem;
}
.contact-item p {
  color: var(--text);
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.5;
}

.social-links {
  display: flex;
  gap: 0.9rem;
  margin-top: 20px;
}
.social-link {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-light);
  color: var(--primary-dark);
  transition: all 0.3s var(--ease);
  font-size: 1.05rem;
}
.social-link:hover {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: #fff;
  transform: translateY(-3px);
  box-shadow: 0 8px 16px var(--primary-glow);
}

.contact-page .card {
  border-radius: 24px;
  border: 1px solid var(--surface-border) !important;
  box-shadow: 0 18px 40px rgba(28, 38, 32, 0.06) !important;
  background: var(--surface);
  overflow: visible;
}
.contact-page .card-body h4 {
  font-family: var(--font-heading);
  font-weight: 700;
  color: var(--text);
}
.contact-page .btn-primary {
  border-radius: 999px;
  padding: 0.85rem 1.5rem;
}

.content-contactpage .map-wrapper {
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 14px 28px rgba(28, 38, 32, 0.05);
  border: 1px solid var(--surface-border);
  filter: grayscale(0.25) sepia(0.12);
}

@media (max-width: 576px), (max-width: 786px), (max-width: 1024px) {
  .contact-page {
    padding: 6rem 0 3rem;
  }
  .contact-page.page-detail {
    width: calc(100% - 30px);
  }
}
</style>
