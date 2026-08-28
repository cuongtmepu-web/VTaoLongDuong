<template>
  <nav class="admin-sidebar">
    <ul class="nav flex-column">
      <li class="nav-item">
        <router-link to="/admin/dashboard" class="nav-link" active-class="active">
          <i class="bi bi-grid-1x2-fill"></i> Dashboard
        </router-link>
      </li>

      <li class="nav-item nav-header">Quản lý</li>

      <li class="nav-item">
        <router-link to="/admin/users" class="nav-link" active-class="active">
          <i class="bi bi-people-fill"></i> Người dùng
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/admin/doctors" class="nav-link" active-class="active">
          <i class="bi bi-person-heart"></i> Bác sĩ
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/admin/appointments" class="nav-link" active-class="active">
          <i class="bi bi-calendar-check-fill"></i> Lịch hẹn
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/admin/medical-records" class="nav-link" active-class="active">
          <i class="bi bi-file-medical-fill"></i> Hồ sơ bệnh án
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/admin/orders" class="nav-link" active-class="active">
          <i class="bi bi-receipt-fill"></i> Đơn hàng
        </router-link>
      </li>

      <li class="nav-item nav-header">Nội dung</li>

      <li class="nav-item">
        <router-link to="/admin/blog/posts" class="nav-link" active-class="active">
          <i class="bi bi-newspaper"></i> Blog
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/admin/landing" class="nav-link" active-class="active">
          <i class="bi bi-layout-text-window"></i> Trang chủ
        </router-link>
      </li>

      <li class="nav-item nav-header">Báo cáo</li>

      <li class="nav-item">
        <router-link to="/admin/reports/revenue" class="nav-link" active-class="active">
          <i class="bi bi-bar-chart-fill"></i> Doanh thu
        </router-link>
      </li>

      <li class="nav-item nav-header">Cài đặt</li>

      <li class="nav-item">
        <router-link to="/admin/settings/general" class="nav-link" active-class="active">
          <i class="bi bi-gear-fill"></i> Cài đặt chung
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/admin/settings/payment" class="nav-link" active-class="active">
          <i class="bi bi-credit-card-fill"></i> Cổng thanh toán
        </router-link>
      </li>

      <li class="nav-item mt-3">
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
.admin-sidebar .nav-link {
  color: rgba(255, 255, 255, 0.7);
  padding: 10px 20px;
  border-radius: 8px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 10px;
}

.admin-sidebar .nav-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.admin-sidebar .nav-link.active {
  color: white;
  background: rgba(255, 255, 255, 0.15);
}

.admin-sidebar .nav-link i {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
}

.admin-sidebar .nav-header {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 15px 20px 8px;
  font-weight: bold;
}
</style>
