<template>
  <section class="about-section py-5">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h2 class="section-title">{{ sectionData.title || 'Về chúng tôi' }}</h2>
          <div class="about-content" v-html="sectionData.content || defaultContent"></div>
          <div class="mt-4">
            <div class="row g-4">
              <div class="col-sm-6">
                <div class="stat-box">
                  <h3 class="text-warning">10+</h3>
                  <p class="text-muted">Năm kinh nghiệm</p>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="stat-box">
                  <h3 class="text-warning">500+</h3>
                  <p class="text-muted">Khách hàng đã điều trị</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <img
            :src="sectionData.image || '/images/about.jpg'"
            alt="Về chúng tôi"
            class="img-fluid rounded shadow"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLandingStore } from '@/api/stores/landing'

const landingStore = useLandingStore()

const sectionData = computed(() => landingStore.getSection('about'))

const defaultContent = `
  <p class="lead">Tảo Long Đường là phòng khám Đông y gia truyền với hơn 10 năm kinh nghiệm trong việc chăm sóc sức khỏe cộng đồng.</p>
  <p>Chúng tôi tự hào là nơi kết nối giữa y học cổ truyền và hiện đại, mang đến cho bệnh nhân những phương pháp điều trị hiệu quả và an toàn nhất.</p>
  <ul>
    <li>Đội ngũ bác sĩ giàu kinh nghiệm</li>
    <li>Phương pháp điều trị kết hợp Đông - Tây y</li>
    <li>Môi trường thân thiện, tận tâm</li>
  </ul>
`
</script>

<style scoped>
.about-section {
  background: #f8f9fa;
}

.section-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.stat-box {
  text-align: center;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.stat-box h3 {
  font-size: 2.5rem;
  font-weight: bold;
}
</style>
