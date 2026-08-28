<template>
  <DefaultLayout>
    <div class="landing-page">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <DoctorsSection />
      <TestimonialsSection />
      <BlogSection />
      <ContactSection />
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
</style>
