<template>
  <footer class="app-footer">
    <div class="mist-layer"></div>
    <div class="container footer-inner">
      <div class="footer-brand">
        <div class="brand-mark">
          <svg viewBox="0 0 100 100" class="footer-taiji" aria-hidden="true">
            <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" stroke-width="3" />
            <path
              d="M50,3 A23.5,23.5 0 0,1 50,50 A23.5,23.5 0 0,0 50,97 A47,47 0 0,1 50,3 Z"
              fill="currentColor"
            />
            <circle cx="50" cy="26.5" r="7" fill="#1c2620" />
            <circle cx="50" cy="73.5" r="7" fill="currentColor" />
          </svg>
        </div>
        <div>
          <h5>Tảo Long Đường</h5>
          <p>Phòng khám Đông y gia truyền với hơn 10 năm kinh nghiệm</p>
        </div>
      </div>

      <div class="footer-block">
        <h6>Liên hệ</h6>
        <ul>
          <li>
            <i class="bi bi-geo-alt"></i> Số 6, trại Hậu, TDP Đông Lương, Phường Việt Yên, Thành phố
            Bắc Ninh
          </li>
          <li><i class="bi bi-phone"></i> 0364 145 761</li>
          <li><i class="bi bi-envelope"></i> cuongtm@taolongduong.com</li>
        </ul>
      </div>

      <div class="footer-block">
        <h6>Giờ làm việc</h6>
        <ul>
          <li>Thứ 2 - Thứ 6: 8:00 - 20:00</li>
          <li>Thứ 7: 8:00 - 17:00</li>
          <li>Chủ nhật: Nghỉ</li>
        </ul>
      </div>
    </div>

    <div class="container footer-bottom">
      <span class="footer-divider">
        <span class="line"></span>
        <svg viewBox="0 0 100 100" class="mini-taiji" aria-hidden="true">
          <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" stroke-width="4" />
          <path
            d="M50,3 A23.5,23.5 0 0,1 50,50 A23.5,23.5 0 0,0 50,97 A47,47 0 0,1 50,3 Z"
            fill="currentColor"
          />
          <circle cx="50" cy="26.5" r="7" fill="#1c2620" />
          <circle cx="50" cy="73.5" r="7" fill="currentColor" />
        </svg>
        <span class="line"></span>
      </span>
      <span
        >© {{ currentYear }} Tảo Long Đường — Thái Cực sinh Lưỡng Nghi, dưỡng sinh trọn đời.</span
      >
      <span>All rights reserved.</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.app-footer {
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #16241f 0%, #0f1a16 100%);
  color: rgba(250, 246, 236, 0.72);
  padding: 3.4rem 0 1.4rem;
  margin-top: auto;
}
.app-footer :deep(.mist-layer)::before {
  background: radial-gradient(circle, rgba(185, 122, 69, 0.16), transparent 70%);
}
.app-footer :deep(.mist-layer)::after {
  background: radial-gradient(circle, rgba(173, 138, 77, 0.14), transparent 70%);
  mix-blend-mode: screen;
}

.footer-inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 2.5rem;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-brand {
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
}
.footer-brand .brand-mark {
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gold-light);
  box-shadow: 0 0 0 1px rgba(233, 216, 179, 0.35);
}
.footer-taiji {
  width: 26px;
  height: 26px;
}
.footer-brand h5 {
  color: var(--gold-light);
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 0.3rem;
}
.footer-brand p {
  font-size: 0.9rem;
  opacity: 0.75;
  line-height: 1.6;
}
.footer-block h6 {
  color: var(--gold-light);
  font-weight: 600;
  letter-spacing: 0.03em;
  margin-bottom: 0.9rem;
}
.footer-block ul {
  list-style: none;
  padding: 0;
}
.footer-block ul li {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.92rem;
}
.footer-block ul li i {
  color: var(--secondary-light);
}

.footer-bottom {
  position: relative;
  z-index: 1;
  border-top: 1px solid rgba(250, 246, 236, 0.1);
  margin-top: 2.2rem;
  padding-top: 1.6rem;
  text-align: center;
  font-size: 0.82rem;
  opacity: 0.6;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}
.footer-divider {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  opacity: 0.8;
}
.footer-divider .line {
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold-light), transparent);
}
.mini-taiji {
  width: 16px;
  height: 16px;
  color: var(--gold-light);
}

@media (max-width: 768px) {
  .footer-inner {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
