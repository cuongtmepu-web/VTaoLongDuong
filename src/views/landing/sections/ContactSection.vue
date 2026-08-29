<template>
  <section class="contact-section py-5">
    <div class="container">
      <div class="row g-4">
        <div class="col-lg-5">
          <div class="contact-heading">
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
                <p>{{ sectionData.address || 'Số 123, Đường ABC, Quận XYZ, TP.HCM' }}</p>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">
                <i class="bi bi-phone"></i>
              </div>
              <div class="info-copy">
                <span class="info-label">Điện thoại</span>
                <p>{{ sectionData.phone || '0987 654 321' }}</p>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">
                <i class="bi bi-envelope"></i>
              </div>
              <div class="info-copy">
                <span class="info-label">Email</span>
                <p>{{ sectionData.email || 'contact@taolongduong.com' }}</p>
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
            <a href="#" class="social-link" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
            <a href="#" class="social-link" aria-label="YouTube"><i class="bi bi-youtube"></i></a>
            <a href="#" class="social-link" aria-label="Zalo"><i class="bi bi-instagram"></i></a>
            <a href="#" class="social-link" aria-label="TikTok"><i class="bi bi-tiktok"></i></a>
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
  padding: 5rem 0;
  background: var(--bg);
}

/* Container */
.contact-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Grid 2 cột */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

/* ===== Bên trái: Thông tin ===== */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.contact-info .section-title {
  margin-bottom: 0.2rem;
}
.contact-info .section-title::after {
  width: 50px;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
}

.contact-info .lead {
  color: var(--text-soft);
  font-size: 1.05rem;
  line-height: 1.7;
  margin-bottom: 0.5rem;
}

/* Các thẻ thông tin */
.info-items {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.2rem 1.2rem;
  background: var(--surface);
  border-radius: var(--radius-md);
  border: 1px solid var(--surface-border);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s var(--ease);
}
.info-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-light);
}

.info-item .icon {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  background: var(--primary-light);
  color: var(--primary);
  font-size: 1.2rem;
}
.info-item .content {
  flex: 1;
  min-width: 0;
}
.info-item .content .label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin-bottom: 0.1rem;
}
.info-item .content .value {
  font-weight: 600;
  color: var(--text);
  font-size: 0.95rem;
  line-height: 1.4;
}
.info-item .content .value small {
  display: block;
  font-weight: 400;
  color: var(--text-soft);
  font-size: 0.85rem;
}

/* Social links */
.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}
.social-link {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface);
  border: 1px solid var(--surface-border);
  color: var(--text-soft);
  transition: all 0.3s var(--ease);
  font-size: 1.1rem;
}
.social-link:hover {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
  transform: translateY(-3px);
  box-shadow: 0 8px 16px var(--primary-glow);
}

/* ===== Bên phải: Form ===== */
.contact-form {
  background: var(--surface);
  padding: 2rem 2rem 2.2rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--surface-border);
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.3s var(--ease);
}
.contact-form:hover {
  box-shadow: var(--shadow-md);
}

.contact-form .form-title {
  font-weight: 700;
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  color: var(--text);
}
.contact-form .form-sub {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}

.contact-form .form-group {
  margin-bottom: 1.2rem;
}
.contact-form .form-group label {
  display: block;
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--text-soft);
  margin-bottom: 0.3rem;
}
.contact-form .form-group .form-control,
.contact-form .form-group .form-select,
.contact-form .form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid var(--surface-border);
  border-radius: var(--radius-sm);
  background: var(--bg);
  font-family: inherit;
  font-size: 0.95rem;
  color: var(--text);
  transition:
    border-color 0.3s var(--ease),
    box-shadow 0.3s var(--ease);
  outline: none;
}
.contact-form .form-group .form-control:focus,
.contact-form .form-group .form-select:focus,
.contact-form .form-group textarea:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px var(--primary-glow);
  background: var(--surface);
}
.contact-form .form-group textarea {
  min-height: 120px;
  resize: vertical;
}

.contact-form .btn-submit {
  width: 100%;
  padding: 0.9rem 1.5rem;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  box-shadow: 0 6px 16px var(--primary-glow);
  transition: all 0.3s var(--ease);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
}
.contact-form .btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px var(--primary-glow);
  background: linear-gradient(135deg, var(--primary-dark), var(--primary));
}
.contact-form .btn-submit:disabled {
  opacity: 0.6;
  pointer-events: none;
}

/* ===== Map ===== */
.map-wrapper {
  margin-top: 3.5rem;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--surface-border);
}
.map-wrapper iframe {
  display: block;
  width: 100%;
  height: 280px;
  border: none;
}

/* ===== Responsive ===== */
@media (max-width: 992px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
  .info-items {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 600px) {
  .contact-container {
    padding: 0 1rem;
  }
  .info-items {
    grid-template-columns: 1fr;
  }
  .contact-form {
    padding: 1.5rem;
  }
  .contact-form .form-title {
    font-size: 1.2rem;
  }
  .social-links {
    justify-content: center;
  }
}
</style>
