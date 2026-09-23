<template>
  <section class="contact-section py-5">
    <div class="mist-layer"></div>
    <div class="container">
      <div class="row g-4">
        <div class="col-lg-5">
          <div class="contact-heading">
            <span class="eyebrow-tag">Liên hệ</span>
            <h2 class="section-title mb-3">
              {{ sectionData.title || 'Liên hệ với chúng tôi' }}
            </h2>
            <p class="contact-description">
              {{
                sectionData.description ||
                'Hãy liên hệ với chúng tôi để được tư vấn và hỗ trợ tốt nhất'
              }}
            </p>
          </div>

          <div class="contact-info">
            <div class="info-item">
              <div class="info-icon">
                <i class="bi bi-geo-alt"></i>
              </div>
              <div class="info-copy">
                <span class="info-label">Địa chỉ</span>
                <p>
                  {{
                    sectionData.address ||
                    'Số 6, trại Hậu, TDP Đông Lương, Phường Việt Yên, Thành phố Bắc Ninh'
                  }}
                </p>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">
                <i class="bi bi-phone"></i>
              </div>
              <div class="info-copy">
                <span class="info-label">Điện thoại</span>
                <p>{{ sectionData.phone || '0364 145 761' }}</p>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">
                <i class="bi bi-envelope"></i>
              </div>
              <div class="info-copy">
                <span class="info-label">Email</span>
                <p>{{ sectionData.email || 'cuongtm@taolongduong.com' }}</p>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">
                <i class="bi bi-clock"></i>
              </div>
              <div class="info-copy">
                <span class="info-label">Giờ làm việc</span>
                <p>Thứ 2 - Thứ 6: 8:00 - 20:00</p>
                <p>Thứ 7: 8:00 - 17:00</p>
                <p>Chủ nhật: Nghỉ</p>
              </div>
            </div>
          </div>

          <div class="social-links">
            <a href="/" class="social-link" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
            <a href="/" class="social-link" aria-label="YouTube"><i class="bi bi-youtube"></i></a>
            <a href="/" class="social-link" aria-label="Instagram"
              ><i class="bi bi-instagram"></i
            ></a>
            <a href="/" class="social-link" aria-label="TikTok"><i class="bi bi-tiktok"></i></a>
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
                      <label class="form-label">Họ và tên <span style="color: red">*</span></label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="form.fullName"
                        required
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Email <span style="color: red">*</span></label>
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
            src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d12505.711310427983!2d106.09500752664984!3d21.27264647408584!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2sus!4v1788761359425!5m2!1svi!2sus"
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
import BaseSelect from '@/components/common/BaseSelect.vue'

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
  position: relative;
  padding: 5.5rem 0 0 0;
  background: linear-gradient(180deg, var(--soft-green) 0%, var(--surface) 100%);
  border: none;
  overflow: visible;
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

.contact-heading .section-title::after {
  width: 50px;
  background: linear-gradient(90deg, var(--primary), var(--gold));
}

.contact-description {
  color: var(--text-soft);
  font-size: 1.02rem;
  line-height: 1.75;
  margin-bottom: 1.8rem;
}

/* ===== Thông tin liên hệ ===== */
.contact-heading {
  margin-left: 5px;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  margin-bottom: 1.6rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.1rem 1.2rem;
  background: var(--surface);
  border-radius: 18px;
  border: 1px solid var(--surface-border);
  box-shadow: 0 10px 24px rgba(28, 38, 32, 0.03);
  transition: all 0.3s var(--ease);
}
.info-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 28px rgba(28, 38, 32, 0.08);
  border-color: var(--gold-light);
}

.info-icon {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--primary-light);
  color: var(--primary-dark);
  font-size: 1.15rem;
}
.info-copy {
  flex: 1;
  min-width: 0;
}
.info-label {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--gold);
  margin-bottom: 0.2rem;
}
.info-copy p {
  color: var(--text);
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
}

/* Social links */
.social-links {
  display: flex;
  gap: 0.9rem;
  margin-bottom: 20px;
  justify-content: center;
}
.social-link {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-light);
  border: 1px solid transparent;
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

/* ===== Form liên hệ ===== */
.contact-form-wrapper .card {
  border-radius: 24px;
  border: 1px solid var(--surface-border) !important;
  box-shadow: 0 18px 40px rgba(28, 38, 32, 0.06) !important;
  background: var(--surface);
  overflow: visible;
}
.contact-form-wrapper {
  position: relative;
  z-index: 2;
}
.contact-form-wrapper .card-body {
  overflow: visible;
}
.contact-form-wrapper .card-body h5 {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1.4rem;
  color: var(--text);
}
.contact-form-wrapper .form-label {
  font-weight: 500;
  font-size: 0.88rem;
  color: var(--text-soft);
  margin-bottom: 0.3rem;
}
.contact-form-wrapper .form-control,
.contact-form-wrapper .form-select,
.contact-form-wrapper textarea {
  background: var(--surface-alt);
  border: 1px solid var(--surface-border);
}
.contact-form-wrapper .form-control:focus,
.contact-form-wrapper .form-select:focus,
.contact-form-wrapper textarea:focus {
  border-color: var(--primary);
  background: var(--surface);
}
.contact-form-wrapper .btn-primary {
  border-radius: 999px;
  padding: 0.85rem 1.5rem;
}

/* ===== Map ===== */
.map-wrapper {
  margin-top: 1rem;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 14px 28px rgba(28, 38, 32, 0.05);
  border: 1px solid var(--surface-border);
  filter: grayscale(0.25) sepia(0.12);
}
.map-wrapper iframe {
  display: block;
  width: 100%;
  height: 280px;
  border: none;
}

/* ===== Responsive ===== */
@media (max-width: 600px) {
  .social-links {
    justify-content: center;
  }
}
</style>
