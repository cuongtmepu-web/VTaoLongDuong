import { defineStore } from 'pinia'
import { landingApi } from '@/api/landing'
import { useToast } from '@erag/vue-toastification'
import { type LandingSectionContent } from '@/api/types/landing'

const toast = useToast()

const parseSectionContent = (sectionKey: string, contentJson: string) => {
  try {
    return JSON.parse(contentJson)
  } catch (error) {
    console.error(`Invalid JSON in landing section "${sectionKey}"`, error)

    // Recover the malformed testimonial payload currently returned by the API.
    const repairedJson = contentJson
      .replace(/("avatar"\s*:\s*"[^"]*")\s*("date"\s*:)/g, '$1,$2')
      .replace(/,\s*,/g, ',')
      .replace(/,\s*([}\]])/g, '$1')

    try {
      return JSON.parse(repairedJson)
    } catch (repairError) {
      console.error(`Unable to repair landing section "${sectionKey}"`, repairError)
      return {}
    }
  }
}

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
            this.sections[section.sectionKey] = parseSectionContent(
              section.sectionKey,
              section.contentJson,
            )
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
