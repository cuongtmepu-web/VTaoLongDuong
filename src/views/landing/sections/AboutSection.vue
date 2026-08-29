<template>
  <section class="about-section py-5">
    <div class="container">
      <div class="row align-items-center g-5">
        <div class="col-lg-6 about-col">
          <div class="about-copy">
            <h2 class="section-title">{{ sectionData.title || 'Về chúng tôi' }}</h2>
            <div class="about-content" v-html="sectionData.content || defaultContent"></div>
          </div>

          <div class="stats-grid">
            <div class="stat-box">
              <h3>10+</h3>
              <p>Năm kinh nghiệm</p>
            </div>
            <div class="stat-box">
              <h3>500+</h3>
              <p>Khách hàng đã điều trị</p>
            </div>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="image-frame">
            <img :src="sectionData.image || '/images/about.jpg'" alt="Về chúng tôi" />
          </div>
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
  padding: 5rem 0;
  background: var(--surface);
}

.about-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

/* ===== Nội dung bên trái ===== */
.about-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.about-content .section-title {
  margin-bottom: 0.2rem;
}
.about-content .section-title::after {
  width: 50px;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
}

.about-content .lead {
  font-size: 1.08rem;
  color: var(--text-soft);
  line-height: 1.8;
  margin-bottom: 0.2rem;
  font-weight: 500;
}

.about-content .description {
  color: var(--text-soft);
  line-height: 1.8;
  font-size: 1rem;
}

/* Danh sách đặc điểm với icon check */
.feature-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin: 0.2rem 0 0.5rem;
  padding: 0;
  list-style: none;
}
.feature-list li {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: 500;
  color: var(--text);
}
.feature-list li::before {
  content: '✓';
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--primary-light);
  color: var(--primary);
  font-weight: 700;
  font-size: 0.8rem;
  flex-shrink: 0;
}

/* Số liệu thống kê */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.2rem;
  margin-top: 0.3rem;
}

.stat-item {
  background: var(--bg);
  padding: 1.2rem 1.2rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--surface-border);
  transition: all 0.3s var(--ease);
}
.stat-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-light);
}
.stat-item .number {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--primary);
  letter-spacing: -0.02em;
  line-height: 1.2;
}
.stat-item .label {
  font-size: 0.9rem;
  color: var(--text-muted);
  font-weight: 500;
}

/* ===== Hình ảnh bên phải ===== */
.about-image {
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--surface-border);
  background: var(--bg);
}
.about-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  min-height: 320px;
  display: block;
  transition: transform 0.5s var(--ease);
}
.about-image:hover img {
  transform: scale(1.03);
}

/* ===== Responsive ===== */
@media (max-width: 992px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
  .about-image {
    order: -1;
  }
  .about-image img {
    min-height: 240px;
  }
}

@media (max-width: 600px) {
  .about-container {
    padding: 0 1rem;
  }
  .stats-grid {
    grid-template-columns: 1fr 1fr;
    gap: 0.8rem;
  }
  .stat-item {
    padding: 1rem;
  }
  .stat-item .number {
    font-size: 1.8rem;
  }
  .about-content .section-title {
    font-size: 1.8rem;
  }
}
</style>
