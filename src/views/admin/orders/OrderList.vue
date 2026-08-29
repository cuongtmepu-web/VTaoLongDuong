<template>
  <AdminLayout>
    <div class="order-list">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Quản lý đơn hàng</h2>
        <div class="d-flex gap-2">
          <input
            type="text"
            class="form-control"
            v-model="search"
            placeholder="Tìm kiếm..."
            style="width: 200px"
            @input="onSearch"
          />
          <select
            class="form-select"
            v-model="statusFilter"
            style="width: 150px"
            @change="onSearch"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Pending">Chờ thanh toán</option>
            <option value="Paid">Đã thanh toán</option>
            <option value="Failed">Thất bại</option>
            <option value="Refunded">Đã hoàn</option>
          </select>
          <button class="btn btn-primary" @click="fetchOrders">
            <i class="bi bi-search"></i> Tìm
          </button>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
          </div>
          <div v-else>
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Mã đơn hàng</th>
                    <th>Người dùng</th>
                    <th>Loại</th>
                    <th>Số tiền</th>
                    <th>Phương thức</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in orders" :key="order.orderCode">
                    <td>
                      <span class="fw-bold">{{ order.orderCode }}</span>
                    </td>
                    <td>{{ order.user?.fullName || 'N/A' }}</td>
                    <td>{{ getOrderTypeText(order.orderType) }}</td>
                    <td class="fw-bold text-primary">{{ formatCurrency(order.finalAmount) }}</td>
                    <td>{{ order.paymentMethod || 'Chưa cập nhật' }}</td>
                    <td>
                      <span :class="getPaymentStatusClass(order.paymentStatus)" class="badge">
                        {{ getPaymentStatusText(order.paymentStatus) }}
                      </span>
                    </td>
                    <td>{{ formatDate(order.createdAt) }}</td>
                    <td>
                      <div class="btn-group">
                        <router-link
                          :to="`/admin/orders/${order.orderId}`"
                          class="btn btn-sm btn-outline-primary"
                        >
                          <i class="bi bi-eye"></i>
                        </router-link>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div class="d-flex justify-content-between align-items-center mt-3">
              <span class="text-muted">
                Hiển thị {{ (pagination.currentPage - 1) * pagination.pageSize + 1 }} -
                {{ Math.min(pagination.currentPage * pagination.pageSize, pagination.totalCount) }}
                / {{ pagination.totalCount }} đơn hàng
              </span>
              <nav>
                <ul class="pagination mb-0">
                  <li class="page-item" :class="{ disabled: pagination.currentPage === 1 }">
                    <a
                      class="page-link"
                      href="#"
                      @click.prevent="changePage(pagination.currentPage - 1)"
                      >Trước</a
                    >
                  </li>
                  <li
                    v-for="page in totalPages"
                    :key="page"
                    class="page-item"
                    :class="{ active: page === pagination.currentPage }"
                  >
                    <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                  </li>
                  <li
                    class="page-item"
                    :class="{ disabled: pagination.currentPage === totalPages }"
                  >
                    <a
                      class="page-link"
                      href="#"
                      @click.prevent="changePage(pagination.currentPage + 1)"
                      >Sau</a
                    >
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { orderApi } from '@/api/admin/order'
import type { Order } from '@/api/types/payment'
import { useToast } from '@erag/vue-toastification'
import dayjs from 'dayjs'
import { debounce } from 'lodash'

const toast = useToast()
const loading = ref(false)
const orders = ref<Order[]>([])
const search = ref('')
const statusFilter = ref('')
const pagination = ref({
  currentPage: 1,
  pageSize: 20,
  totalCount: 0,
})

const totalPages = computed(() => {
  return Math.ceil(pagination.value.totalCount / pagination.value.pageSize)
})

const formatDate = (date: string) => {
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

const getOrderTypeText = (type: string) => {
  const texts: Record<string, string> = {
    Consultation: 'Tư vấn',
    Medicine: 'Thuốc',
    Package: 'Gói dịch vụ',
  }
  return texts[type] || type
}

const getPaymentStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    Pending: 'bg-warning',
    Paid: 'bg-success',
    Failed: 'bg-danger',
    Refunded: 'bg-info',
  }
  return classes[status] || 'bg-secondary'
}

const getPaymentStatusText = (status: string) => {
  const texts: Record<string, string> = {
    Pending: 'Chờ thanh toán',
    Paid: 'Đã thanh toán',
    Failed: 'Thất bại',
    Refunded: 'Đã hoàn',
  }
  return texts[status] || status
}

const fetchOrders = async () => {
  loading.value = true
  try {
    const params: any = {
      page: pagination.value.currentPage,
      pageSize: pagination.value.pageSize,
    }
    if (search.value) params.search = search.value
    if (statusFilter.value) params.status = statusFilter.value

    const response = await orderApi.getAll(params)
    if (response.data.success) {
      orders.value = response.data.data.data
      pagination.value.totalCount = response.data.data.pagination.totalCount
    }
  } catch (error) {
    toast.error('Không thể tải danh sách đơn hàng')
  } finally {
    loading.value = false
  }
}

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  pagination.value.currentPage = page
  fetchOrders()
}

const onSearch = debounce(() => {
  pagination.value.currentPage = 1
  fetchOrders()
}, 500)

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.order-list {
  padding: 20px;
}
</style>
