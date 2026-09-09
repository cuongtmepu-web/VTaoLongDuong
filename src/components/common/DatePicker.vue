<template>
  <div ref="root" class="date-picker" :class="{ 'is-open': isOpen }">
    <i class="bi bi-calendar3 date-picker__icon" aria-hidden="true"></i>
    <button
      type="button"
      class="date-picker__trigger"
      :aria-expanded="isOpen"
      :aria-label="label"
      @click="toggle"
    >
      <span :class="{ 'is-placeholder': !modelValue }">{{ displayValue }}</span>
    </button>
    <Transition name="date-picker-popover">
      <div v-if="isOpen" class="date-picker__popover">
        <div class="date-picker__header">
          <button
            type="button"
            class="date-picker__nav"
            aria-label="Tháng trước"
            @click="changeMonth(-1)"
          >
            <i class="bi bi-chevron-left" aria-hidden="true"></i>
          </button>
          <strong>{{ monthLabel }}</strong>
          <button
            type="button"
            class="date-picker__nav"
            aria-label="Tháng sau"
            @click="changeMonth(1)"
          >
            <i class="bi bi-chevron-right" aria-hidden="true"></i>
          </button>
        </div>
        <div class="date-picker__weekdays" aria-hidden="true">
          <span v-for="day in weekdays" :key="day">{{ day }}</span>
        </div>
        <div class="date-picker__days" role="grid">
          <button
            v-for="day in calendarDays"
            :key="day.key"
            type="button"
            class="date-picker__day"
            :class="{
              'is-outside': !day.isCurrentMonth,
              'is-today': day.isToday,
              'is-selected': day.isSelected,
              'is-disabled': day.isBeforeMin,
            }"
            :disabled="day.isBeforeMin"
            @click="selectDate(day.date)"
          >
            {{ day.date.date() }}
          </button>
        </div>
        <button type="button" class="date-picker__today" @click="selectToday">Hôm nay</button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import dayjs, { type Dayjs } from 'dayjs'

const props = withDefaults(defineProps<{ modelValue: string; label?: string; min?: string }>(), {
  label: 'Chọn ngày',
})
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const root = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const calendarMonth = ref(dayjs().startOf('month'))
const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
const monthNames = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
]

const displayValue = computed(() =>
  props.modelValue ? dayjs(props.modelValue).format('DD/MM/YYYY') : 'Chọn ngày',
)
const monthLabel = computed(
  () => `${monthNames[calendarMonth.value.month()]} ${calendarMonth.value.year()}`,
)
const calendarDays = computed(() => {
  const firstDay = calendarMonth.value.startOf('month').startOf('week')
  const today = dayjs().format('YYYY-MM-DD')
  return Array.from({ length: 42 }, (_, index) => {
    const date = firstDay.add(index, 'day')
    const value = date.format('YYYY-MM-DD')
    return {
      date,
      key: value,
      isCurrentMonth: date.month() === calendarMonth.value.month(),
      isToday: value === today,
      isSelected: value === props.modelValue,
      isBeforeMin: Boolean(props.min && value < props.min),
    }
  })
})

const toggle = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value && props.modelValue)
    calendarMonth.value = dayjs(props.modelValue).startOf('month')
}
const changeMonth = (amount: number) => {
  calendarMonth.value = calendarMonth.value.add(amount, 'month')
}
const selectDate = (date: Dayjs) => {
  emit('update:modelValue', date.format('YYYY-MM-DD'))
  isOpen.value = false
}
const selectToday = () => selectDate(dayjs())
const handleOutsideClick = (event: MouseEvent) => {
  if (root.value && !root.value.contains(event.target as Node)) isOpen.value = false
}

onMounted(() => document.addEventListener('click', handleOutsideClick))
onBeforeUnmount(() => document.removeEventListener('click', handleOutsideClick))
</script>

<style scoped>
.date-picker {
  position: relative;
  width: 100%;
  z-index: 1;
}
.date-picker.is-open {
  z-index: 50;
}
.date-picker__icon {
  position: absolute;
  top: 50%;
  left: 1rem;
  z-index: 1;
  color: var(--primary);
  pointer-events: none;
  transform: translateY(-50%);
}
.date-picker__trigger {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 48px;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  color: var(--text);
  background: var(--surface);
  border: 1px solid rgba(47, 111, 99, 0.16);
  border-radius: var(--radius-sm);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: all 0.25s var(--ease);
}
.date-picker__trigger:hover,
.date-picker.is-open .date-picker__trigger {
  background: var(--surface-alt);
  border-color: var(--primary);
  box-shadow: 0 0 0 4px var(--primary-glow);
}
.date-picker__trigger .is-placeholder {
  color: var(--text-muted);
}
.date-picker__popover {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  z-index: 60;
  width: min(300px, 100%);
  padding: 1rem;
  background: var(--surface);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
}
.date-picker__header,
.date-picker__weekdays,
.date-picker__days {
  display: grid;
  align-items: center;
}
.date-picker__header {
  grid-template-columns: 2rem 1fr 2rem;
  gap: 0.5rem;
  margin-bottom: 0.9rem;
  color: var(--primary-dark);
  text-align: center;
}
.date-picker__nav {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  color: var(--primary);
  border-radius: 50%;
}
.date-picker__nav:hover,
.date-picker__nav:focus-visible {
  color: var(--primary-dark);
  background: var(--primary-light);
  outline: none;
}
.date-picker__weekdays,
.date-picker__days {
  grid-template-columns: repeat(7, minmax(0, 1fr));
}
.date-picker__weekdays {
  margin-bottom: 0.35rem;
  color: var(--text-muted);
  font-size: 0.68rem;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
}
.date-picker__days {
  row-gap: 0.2rem;
}
.date-picker__day {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  justify-self: center;
  width: 2rem;
  height: 2rem;
  color: var(--text-soft);
  border-radius: 50%;
  font-size: 0.78rem;
}
.date-picker__day:hover,
.date-picker__day:focus-visible {
  color: var(--primary-dark);
  background: var(--primary-light);
  outline: none;
}
.date-picker__day.is-outside {
  color: var(--text-muted);
  opacity: 0.48;
}
.date-picker__day.is-disabled {
  pointer-events: none;
  opacity: 0.25;
}
.date-picker__day.is-today {
  box-shadow: inset 0 0 0 1px var(--gold);
}
.date-picker__day.is-selected {
  color: var(--surface);
  background: var(--primary);
  box-shadow: none;
  font-weight: 700;
}
.date-picker__today {
  width: 100%;
  margin-top: 0.9rem;
  padding-top: 0.7rem;
  color: var(--secondary-dark);
  border-top: 1px solid var(--surface-border);
  font-size: 0.78rem;
  font-weight: 700;
}
.date-picker__today:hover,
.date-picker__today:focus-visible {
  color: var(--primary-dark);
  outline: none;
}
.date-picker-popover-enter-active,
.date-picker-popover-leave-active {
  transition:
    opacity 0.18s var(--ease),
    transform 0.18s var(--ease);
}
.date-picker-popover-enter-from,
.date-picker-popover-leave-to {
  opacity: 0;
  transform: translateY(-0.35rem);
}
@media (max-width: 576px) {
  .date-picker__trigger {
    min-height: 46px;
  }
  .date-picker__popover {
    width: min(300px, calc(100vw - 2rem));
  }
}
</style>
