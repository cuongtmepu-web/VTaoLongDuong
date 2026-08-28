<template>
  <footer class="app-footer bg-dark text-white py-4">
    <div class="container">
      <div class="row">
        <div class="col-md-4">
          <h5>Tảo Long Đường</h5>
          <p class="text-muted small">Phòng khám Đông y gia truyền với hơn 10 năm kinh nghiệm</p>
        </div>
        <div class="col-md-4">
          <h5>Liên hệ</h5>
          <ul class="list-unstyled text-muted small">
            <li><i class="bi bi-geo-alt"></i> Số 123, Đường ABC, Quận XYZ, TP.HCM</li>
            <li><i class="bi bi-phone"></i> 0987 654 321</li>
            <li><i class="bi bi-envelope"></i> contact@taolongduong.com</li>
          </ul>
        </div>
        <div class="col-md-4">
          <h5>Giờ làm việc</h5>
          <ul class="list-unstyled text-muted small">
            <li>Thứ 2 - Thứ 6: 8:00 - 20:00</li>
            <li>Thứ 7: 8:00 - 17:00</li>
            <li>Chủ nhật: Nghỉ</li>
          </ul>
        </div>
      </div>
      <hr class="border-secondary" />
      <div class="text-center text-muted small">
        © {{ currentYear }} Tảo Long Đường. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.app-footer {
  margin-top: auto;
}
</style>
