<template>
  <div class="analytics-grid">
    <section class="analytics-panel">
      <div class="panel-heading">
        <div>
          <span class="panel-kicker">Lịch hẹn</span>
          <h3>Phân bổ trạng thái</h3>
        </div>
        <i class="bi bi-pie-chart-fill panel-icon" aria-hidden="true"></i>
      </div>
      <div class="chart-wrap chart-wrap-doughnut">
        <canvas ref="statusCanvas"></canvas>
      </div>
    </section>

    <section class="analytics-panel">
      <div class="panel-heading">
        <div>
          <span class="panel-kicker">Xu hướng</span>
          <h3>Lịch hẹn gần đây</h3>
        </div>
        <i class="bi bi-bar-chart-fill panel-icon" aria-hidden="true"></i>
      </div>
      <div class="chart-wrap">
        <canvas ref="trendCanvas"></canvas>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Chart, registerables, type ChartConfiguration } from 'chart.js'
import type { Appointment } from '@/api/types/appointment'
import dayjs from 'dayjs'

Chart.register(...registerables)

const props = defineProps<{ appointments: Appointment[] }>()
const statusCanvas = ref<HTMLCanvasElement | null>(null)
const trendCanvas = ref<HTMLCanvasElement | null>(null)
let statusChart: Chart | null = null
let trendChart: Chart | null = null

const destroyCharts = () => {
  statusChart?.destroy()
  trendChart?.destroy()
  statusChart = null
  trendChart = null
}

const renderCharts = () => {
  destroyCharts()

  if (statusCanvas.value) {
    const counts = {
      Pending: props.appointments.filter((item) => item.status === 'Pending').length,
      Confirmed: props.appointments.filter((item) => item.status === 'Confirmed').length,
      Completed: props.appointments.filter((item) => item.status === 'Completed').length,
      Cancelled: props.appointments.filter((item) => item.status === 'Cancelled').length,
    }

    statusChart = new Chart(statusCanvas.value, {
      type: 'doughnut',
      data: {
        labels: ['Chờ xác nhận', 'Đã xác nhận', 'Hoàn thành', 'Đã hủy'],
        datasets: [
          {
            data: [counts.Pending, counts.Confirmed, counts.Completed, counts.Cancelled],
            backgroundColor: ['#b97a45', '#668b86', '#2f6f63', '#c78373'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '64%',
        plugins: { legend: { position: 'bottom', labels: { padding: 12, boxWidth: 12 } } },
      },
    } as ChartConfiguration)
  }

  if (trendCanvas.value) {
    const dates = Array.from({ length: 7 }, (_, index) => dayjs().subtract(6 - index, 'day'))
    const values = dates.map(
      (date) =>
        props.appointments.filter((item) => dayjs(item.appointmentDate).isSame(date, 'day')).length,
    )

    trendChart = new Chart(trendCanvas.value, {
      type: 'bar',
      data: {
        labels: dates.map((date) => date.format('DD/MM')),
        datasets: [
          {
            label: 'Lịch hẹn',
            data: values,
            backgroundColor: '#2f6f63',
            borderRadius: 7,
            maxBarThickness: 34,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 },
            grid: { color: 'rgba(47, 111, 99, 0.08)' },
          },
          x: { grid: { display: false } },
        },
      },
    } as ChartConfiguration)
  }
}

watch(
  () => props.appointments,
  async () => {
    await nextTick()
    renderCharts()
  },
  { deep: true },
)

onMounted(() => renderCharts())
onBeforeUnmount(destroyCharts)
</script>

<style scoped>
.analytics-grid {
  display: grid;
  grid-template-columns: minmax(260px, 0.85fr) minmax(320px, 1.15fr);
  gap: 1rem;
  margin-top: 1.5rem;
}

.analytics-panel {
  min-height: 330px;
  padding: 1.25rem;
  background: rgba(255, 253, 248, 0.9);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.panel-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.panel-kicker {
  color: var(--secondary-dark);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.panel-heading h3 {
  margin: 0.15rem 0 0;
  color: var(--primary-dark);
  font-family: var(--font-heading);
  font-size: 1.3rem;
}

.panel-icon {
  color: var(--gold);
  font-size: 1.2rem;
}

.chart-wrap {
  position: relative;
  height: 235px;
}

.chart-wrap-doughnut {
  height: 240px;
}

@media (max-width: 900px) {
  .analytics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
