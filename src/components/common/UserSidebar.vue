<template>
  <nav class="user-sidebar">
    <ul class="nav flex-column">
      <li class="nav-item">
        <router-link to="/user/dashboard" class="nav-link" active-class="active">
          <i class="bi bi-grid-1x2-fill"></i> Dashboard
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/user/appointments" class="nav-link" active-class="active">
          <i class="bi bi-calendar-check-fill"></i> Lịch hẹn
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/user/appointments/book" class="nav-link" active-class="active">
          <i class="bi bi-calendar-plus-fill"></i> Đặt lịch mới
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/user/medical-records" class="nav-link" active-class="active">
          <i class="bi bi-file-medical-fill"></i> Hồ sơ bệnh án
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/user/orders" class="nav-link" active-class="active">
          <i class="bi bi-receipt-fill"></i> Lịch sử thanh toán
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/user/profile" class="nav-link" active-class="active">
          <i class="bi bi-person-fill"></i> Thông tin cá nhân
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/user/change-password" class="nav-link" active-class="active">
          <i class="bi bi-key-fill"></i> Đổi mật khẩu
        </router-link>
      </li>
      <li class="nav-item">
        <a href="#" class="nav-link text-danger" @click.prevent="authStore.logout">
          <i class="bi bi-box-arrow-right"></i> Đăng xuất
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/api/stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
.user-sidebar .nav-link {
  color: #495057;
  padding: 12px 20px;
  border-radius: 8px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-sidebar .nav-link:hover {
  background: #e9ecef;
  color: #2c3e50;
}

.user-sidebar .nav-link.active {
  background: #2c3e50;
  color: white;
}

.user-sidebar .nav-link i {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
}
</style>
