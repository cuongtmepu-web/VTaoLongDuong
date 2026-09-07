import { defineStore } from 'pinia'
import { landingApi } from '@/api/Landing'
import { useToast } from '@erag/vue-toastification'
import { type LandingSectionContent } from '@/api/types/landing'

const toast = useToast()

interface LandingState {
  sections: Record<string, LandingSectionContent>
  loading: boolean
}

export const useLandingStore = defineStore('landing', {
  state: (): LandingState => ({
    sections: {},
    loading: false,
  }),

  getters: {
    getSection:
      (state) =>
      (key: string): LandingSectionContent => {
        return state.sections[key] || {}
      },
  },

  actions: {
    async fetchSections(): Promise<void> {
      this.loading = true
      try {
        const response = await landingApi.getAll()
        if (response.data.success) {
          this.sections = {}
          response.data.data.forEach((section) => {
            try {
              this.sections[section.sectionKey] = JSON.parse(section.contentJson)
            } catch {
              this.sections[section.sectionKey] = {}
            }
          })
        }
      } catch (error: any) {
        console.error('Failed to fetch landing sections:', error)
        toast.error('Không thể tải nội dung trang chủ')
      } finally {
        this.loading = false
      }
    },
  },
})
