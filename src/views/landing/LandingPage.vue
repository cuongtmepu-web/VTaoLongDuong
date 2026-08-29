<template>
  <DefaultLayout>
    <div class="landing-page">
      <HeroSection />

      <div class="content-band">
        <AboutSection />
        <ServicesSection />
        <DoctorsSection />
        <TestimonialsSection />
        <BlogSection />
        <ContactSection />
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import HeroSection from './sections/HeroSection.vue'
import AboutSection from './sections/AboutSection.vue'
import ServicesSection from './sections/ServicesSection.vue'
import DoctorsSection from './sections/DoctorsSection.vue'
import TestimonialsSection from './sections/TestimonialsSection.vue'
import BlogSection from './sections/BlogSection.vue'
import ContactSection from './sections/ContactSection.vue'
import { useLandingStore } from '@/api/stores/landing'

const landingStore = useLandingStore()

onMounted(() => {
  landingStore.fetchSections()
})
</script>

<style scoped>
.landing-page {
  overflow-x: hidden;
}
.content-band {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}
.content-band > * {
  width: 100%;
}
</style>
