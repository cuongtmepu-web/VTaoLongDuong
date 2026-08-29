<template>
  <div class="revenue-chart">
    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border text-primary"></div>
    </div>
    <div v-else-if="!chartData || chartData.length === 0" class="text-center py-4">
      <p class="text-muted">Chưa có dữ liệu doanh thu</p>
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

interface RevenueData {
  date: string
  revenue: number
}

const props = defineProps<{
  data?: RevenueData[]
  loading?: boolean
}>()

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const defaultData: RevenueData[] = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN'),
  revenue: Math.floor(Math.random() * 5000000) + 1000000,
}))

const chartData = computed(() => {
  return props.data && props.data.length > 0 ? props.data : defaultData
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

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
    type: 'line',
    data: {
      labels: data.map((item) => item.date),
      datasets: [
        {
          label: 'Doanh thu',
          data: data.map((item) => item.revenue),
          borderColor: '#2c3e50',
          backgroundColor: 'rgba(44, 62, 80, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#2c3e50',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
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
                label += formatCurrency(context.parsed.y)
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
            callback: function (value) {
              return formatCurrency(value as number)
            },
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
    chartInstance.data.datasets[0].data = data.map((item) => item.revenue)
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
.revenue-chart {
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
