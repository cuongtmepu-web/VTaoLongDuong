<template>
  <footer class="app-footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <div class="brand-mark"><i class="bi bi-flower2"></i></div>
        <div>
          <h5>Tảo Long Đường</h5>
          <p>Phòng khám Đông y gia truyền với hơn 10 năm kinh nghiệm</p>
        </div>
      </div>

      <div class="footer-block">
        <h6>Liên hệ</h6>
        <ul>
          <li><i class="bi bi-geo-alt"></i> Số 123, Đường ABC, Quận XYZ, TP.HCM</li>
          <li><i class="bi bi-phone"></i> 0987 654 321</li>
          <li><i class="bi bi-envelope"></i> contact@taolongduong.com</li>
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
      <span>© {{ currentYear }} Tảo Long Đường.</span>
      <span>All rights reserved.</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.app-footer {
  background: var(--text);
  color: rgba(255, 255, 255, 0.7);
  padding: 3rem 0 1rem;
  margin-top: auto;
}

.footer-inner {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 2.5rem;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-brand h5 {
  color: #fff;
  font-weight: 700;
  margin-bottom: 0.3rem;
}
.footer-brand p {
  font-size: 0.9rem;
  opacity: 0.7;
}
.footer-block h6 {
  color: #fff;
  font-weight: 600;
  margin-bottom: 0.8rem;
}
.footer-block ul {
  list-style: none;
  padding: 0;
}
.footer-block ul li {
  margin-bottom: 0.4rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.footer-block ul li i {
  color: var(--secondary);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 2rem;
  padding-top: 1.5rem;
  text-align: center;
  font-size: 0.85rem;
  opacity: 0.6;
}

@media (max-width: 768px) {
  .footer-inner {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
