<template>
  <div class="appointment-chart">
    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border text-primary"></div>
    </div>
    <div v-else-if="!chartData || chartData.length === 0" class="text-center py-4">
      <p class="text-muted">Chưa có dữ liệu lịch hẹn</p>
    </div>
    <div v-else>
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { Chart, registerables, type ChartConfiguration, type ChartData } from 'chart.js'

// Register Chart.js components
Chart.register(...registerables)

interface AppointmentData {
  date: string
  appointments: number
}

const props = defineProps<{
  data?: AppointmentData[]
  loading?: boolean
}>()

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const defaultData: AppointmentData[] = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN'),
  appointments: Math.floor(Math.random() * 8) + 1,
}))

const chartData = computed(() => {
  return props.data && props.data.length > 0 ? props.data : defaultData
})

const createChart = () => {
  if (!chartCanvas.value) return

  // Destroy existing chart
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  const data = chartData.value

  const chartConfig: ChartConfiguration = {
    type: 'bar',
    data: {
      labels: data.map((item) => item.date),
      datasets: [
        {
          label: 'Số lịch hẹn',
          data: data.map((item) => item.appointments),
          backgroundColor: 'rgba(44, 62, 80, 0.8)',
          borderColor: '#2c3e50',
          borderWidth: 1,
          borderRadius: 4,
          maxBarThickness: 40,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            font: {
              size: 14,
              weight: 'bold',
            },
            padding: 20,
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || ''
              if (label) {
                label += ': '
              }
              if (context.parsed.y !== null) {
                label += context.parsed.y + ' lịch hẹn'
              }
              return label
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            font: {
              size: 11,
            },
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 11,
            },
            maxTicksLimit: 15,
          },
        },
      },
      interaction: {
        intersect: false,
        mode: 'index',
      },
    },
  }

  chartInstance = new Chart(ctx, chartConfig)
}

const updateChart = () => {
  if (chartInstance && chartInstance.data.datasets[0]) {
    const data = chartData.value
    chartInstance.data.labels = data.map((item) => item.date)
    chartInstance.data.datasets[0].data = data.map((item) => item.appointments)
    chartInstance.update()
  } else {
    createChart()
  }
}

// Watch for data changes
watch(
  () => props.data,
  () => {
    updateChart()
  },
  { deep: true },
)

// Watch for loading changes
watch(
  () => props.loading,
  (newVal) => {
    if (!newVal) {
      setTimeout(() => {
        updateChart()
      }, 100)
    }
  },
)

onMounted(() => {
  setTimeout(() => {
    createChart()
  }, 100)
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>

<style scoped>
.appointment-chart {
  width: 100%;
  height: 100%;
  min-height: 300px;
  position: relative;
}

canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
