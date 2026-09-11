<template>
  <section class="about-section py-5">
    <div class="mist-layer"></div>
    <div class="container">
      <div class="row align-items-center g-5">
        <div class="col-lg-6 about-col">
          <div class="about-copy">
            <div class="eyebrow-tag">Về Tảo Long Đường</div>
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
            <img :src="sectionData.image || defaultAboutImg" alt="Về chúng tôi" />
          </div>
        </div>
      </div>

      <!-- Triết lý Thái Cực: nền tảng tư duy Đông y của phòng khám -->
      <div class="philosophy-strip">
        <div class="section-divider">
          <span class="line"></span>
          <svg class="taiji-icon" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" stroke-width="3" />
            <path
              d="M50,3 A23.5,23.5 0 0,1 50,50 A23.5,23.5 0 0,0 50,97 A47,47 0 0,1 50,3 Z"
              fill="currentColor"
            />
            <circle cx="50" cy="26.5" r="7" fill="var(--surface)" />
            <circle cx="50" cy="73.5" r="7" fill="currentColor" />
          </svg>
          <span class="line right"></span>
        </div>
        <h3 class="philosophy-title">Thái Cực — cội nguồn của mọi liệu pháp</h3>
        <p class="philosophy-lead">
          "Thái Cực sinh Lưỡng Nghi, Lưỡng Nghi sinh Tứ Tượng, Tứ Tượng sinh Bát Quái" — từ một gốc
          cân bằng duy nhất, vạn vật biến hóa. Đó cũng là cách Tảo Long Đường nhìn nhận cơ thể con
          người: mọi liệu trình đều bắt đầu từ việc lập lại thế cân bằng Âm - Dương.
        </p>
        <div class="philosophy-grid">
          <div class="ph-card">
            <span class="ph-glyph">一</span>
            <h4>Thái Cực</h4>
            <p>Gốc cân bằng — nền tảng chẩn đoán tổng thể trước khi đi vào chi tiết.</p>
          </div>
          <div class="ph-card">
            <span class="ph-glyph">二</span>
            <h4>Lưỡng Nghi</h4>
            <p>Âm - Dương — xác định hàn nhiệt, hư thực của cơ thể người bệnh.</p>
          </div>
          <div class="ph-card">
            <span class="ph-glyph">四</span>
            <h4>Tứ Tượng</h4>
            <p>Bốn trạng thái chuyển hóa — định hướng phác đồ điều trị phù hợp.</p>
          </div>
          <div class="ph-card">
            <span class="ph-glyph">八</span>
            <h4>Bát Quái</h4>
            <p>Tám phương diện — cá nhân hóa bài thuốc theo từng thể trạng riêng.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLandingStore } from '@/api/stores/landing'
import defaultAboutImg from '@/images/about.jpg'

const landingStore = useLandingStore()

const sectionData = computed(() => landingStore.getSection('about'))

const defaultContent = `
  <p class="lead">Tảo Long Đường là phòng khám Đông y gia truyền với nhiều năm kinh nghiệm trong việc chăm sóc sức khỏe cộng đồng.</p>
  <p class="description">Chúng tôi tự hào là nơi kết nối giữa y học cổ truyền và hiện đại, mang đến cho bệnh nhân những phương pháp điều trị hiệu quả và an toàn nhất.</p>
  <ul class="feature-list">
    <li>Đội ngũ bác sĩ giàu kinh nghiệm</li>
    <li>Phương pháp điều trị kết hợp Đông - Tây y</li>
    <li>Môi trường thân thiện, tận tâm</li>
  </ul>
`
</script>

<style scoped>
.about-section {
  position: relative;
  padding: 5.5rem 0 4.5rem;
  background: linear-gradient(180deg, var(--surface) 0%, var(--soft-green) 100%);
  border: none;
  box-shadow: none;
  overflow: hidden;
}

.container {
  position: relative;
  z-index: 1;
}

.about-copy {
  max-width: 760px;
  margin-left: 5px;
}

.eyebrow-tag {
  margin-bottom: 0.6rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold);
}

.section-title {
  margin: 0 0 1.1rem;
  position: relative;
  display: inline-block;
  font-size: clamp(3rem, 4vw, 4.3rem);
  line-height: 0.95;
  color: var(--text);
  font-weight: 600;
}

.section-title::after {
  content: '';
  display: block;
  width: 68px;
  height: 4px;
  margin-top: 0.7rem;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  box-shadow: 0 5px 18px rgba(79, 185, 175, 0.3);
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  margin-left: 2.6rem;
}

.about-content .lead,
.about-content .description,
.about-content li {
  font-family: var(--font-body);
}

.about-content .lead {
  font-size: 1.12rem;
  color: var(--text-soft);
  line-height: 1.9;
  margin: 0;
  font-weight: 500;
}

.about-content .description {
  color: var(--text-soft);
  line-height: 1.9;
  font-size: 1.03rem;
  margin: 0;
}

.about-content .feature-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin: 0.2rem 0 0 0;
  padding: 0;
  list-style: none;
}

.about-content .feature-list li {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  color: var(--text);
  font-weight: 500;
  line-height: 1.7;
  padding-left: 0;
}

.about-content .feature-list li::before {
  content: none;
}

.image-frame {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid var(--gold-light);
  box-shadow: 0 16px 36px rgba(28, 38, 32, 0.1);
  background: var(--surface);
}

.image-frame::before {
  content: '';
  position: absolute;
  inset: 1rem 1rem auto auto;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: var(--mist-1);
  filter: blur(10px);
  z-index: 0;
}

.image-frame img {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  min-height: 440px;
  object-fit: cover;
  display: block;
  transition: transform 0.5s var(--ease);
}

.image-frame:hover img {
  transform: scale(1.03);
}

.stats-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.4rem;
  margin-top: 2rem;
  width: 100%;
  margin-left: 0.6rem;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.stat-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 128px;
  padding: 1.2rem 1.25rem;
  border-radius: 18px;
  background: var(--surface);
  border: 1px solid var(--surface-border);
  box-shadow: 0 10px 24px rgba(28, 38, 32, 0.05);
}

.stat-box h3 {
  margin: 0 0 0.35rem;
  font-size: clamp(2.3rem, 3vw, 3.2rem);
  line-height: 0.95;
  color: var(--text);
  font-family: var(--font-heading);
  font-weight: 600;
  text-align: center;
}

.stat-box p {
  margin: 0;
  color: var(--text-soft);
  font-size: 0.98rem;
  line-height: 1.6;
  text-align: center;
}

/* ===== Triết lý Thái Cực ===== */
.philosophy-strip {
  margin-top: 5rem;
  padding-top: 3.5rem;
  border-top: 1px solid var(--surface-border);
  text-align: center;
}

.philosophy-title {
  font-size: clamp(1.6rem, 2.6vw, 2.2rem);
  font-weight: 600;
  color: var(--text);
  margin: 1.2rem 0 0.8rem;
}

.philosophy-lead {
  max-width: 680px;
  margin: 0 auto 2.6rem;
  color: var(--text-soft);
  font-size: 1.02rem;
  line-height: 1.85;
}

.philosophy-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.4rem;
}

.ph-card {
  position: relative;
  padding: 1.8rem 1.3rem;
  border-radius: 18px;
  background: var(--surface);
  border: 1px solid var(--surface-border);
  box-shadow: 0 10px 24px rgba(28, 38, 32, 0.04);
  transition: all 0.35s var(--ease);
}
.ph-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 32px rgba(28, 38, 32, 0.09);
  border-color: var(--gold-light);
}
.ph-glyph {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  margin-bottom: 0.8rem;
  border-radius: 50%;
  border: 1px solid var(--gold-light);
  color: var(--gold);
  font-family: var(--font-serif-vn);
  font-size: 1.2rem;
}
.ph-card h4 {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.4rem;
}
.ph-card p {
  color: var(--text-soft);
  font-size: 0.9rem;
  line-height: 1.6;
}

@media (max-width: 991.98px) {
  .philosophy-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 991.98px) {
  .about-section {
    padding-top: 4.5rem;
  }

  .image-frame {
    margin-top: 1rem;
  }

  .image-frame img {
    min-height: 300px;
  }
}

@media (max-width: 575.98px) {
  .about-section {
    padding: 4rem 0 3.2rem;
  }

  .section-title {
    font-size: 2.6rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    max-width: 100%;
  }

  .stat-box {
    min-height: 110px;
  }

  .philosophy-strip {
    margin-top: 3.5rem;
    padding-top: 2.5rem;
  }

  .philosophy-grid {
    grid-template-columns: 1fr;
  }
}
</style>
