<template>
  <div ref="root" class="base-select" :class="{ 'is-open': isOpen, 'is-disabled': disabled }">
    <button
      type="button"
      class="base-select__trigger"
      :disabled="disabled"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      @click="toggle"
      @keydown="handleKeydown"
    >
      <span :class="{ 'is-placeholder': !selectedOption }">
        {{ selectedOption?.label || placeholder }}
      </span>
      <i class="bi bi-chevron-down base-select__icon" aria-hidden="true"></i>
    </button>

    <Transition name="base-select-menu">
      <div v-if="isOpen" class="base-select__menu" role="listbox">
        <button
          v-for="option in options"
          :key="String(option.value)"
          type="button"
          class="base-select__option"
          :class="{ 'is-selected': isSelected(option) }"
          role="option"
          :aria-selected="isSelected(option)"
          @click="selectOption(option)"
        >
          <span>{{ option.label }}</span>
          <i v-if="isSelected(option)" class="bi bi-check2" aria-hidden="true"></i>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

export interface BaseSelectOption {
  label: string
  value: string | number | null
}

const props = withDefaults(
  defineProps<{
    modelValue: string | number | null
    options: BaseSelectOption[]
    placeholder?: string
    disabled?: boolean
  }>(),
  {
    placeholder: 'Chọn một mục',
    disabled: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
}>()

const root = ref<HTMLElement | null>(null)
const isOpen = ref(false)

const selectedOption = computed(() =>
  props.options.find((option) => String(option.value) === String(props.modelValue)),
)

const isSelected = (option: BaseSelectOption) => String(option.value) === String(props.modelValue)

const toggle = () => {
  if (!props.disabled) isOpen.value = !isOpen.value
}

const selectOption = (option: BaseSelectOption) => {
  emit('update:modelValue', option.value)
  isOpen.value = false
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    toggle()
  }
  if (event.key === 'Escape') isOpen.value = false
}

const handleDocumentClick = (event: MouseEvent) => {
  if (root.value && !root.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleDocumentClick))
onBeforeUnmount(() => document.removeEventListener('click', handleDocumentClick))
</script>

<style scoped>
.base-select {
  position: relative;
  width: 100%;
}
.base-select__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 48px;
  padding: 0.8rem 1rem 0.8rem 1.2rem;
  border: 1px solid rgba(47, 111, 99, 0.16);
  border-radius: var(--radius-sm);
  background: var(--surface);
  color: var(--text);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: all 0.25s var(--ease);
}
.base-select__trigger:hover,
.base-select.is-open .base-select__trigger {
  border-color: var(--primary);
  background: var(--surface-alt);
  box-shadow: 0 0 0 4px var(--primary-glow);
}
.base-select__trigger:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
.base-select__trigger .is-placeholder {
  color: var(--text-muted);
}
.base-select__icon {
  color: var(--primary);
  transition: transform 0.25s var(--ease);
}
.base-select.is-open .base-select__icon {
  transform: rotate(180deg);
}
.base-select__menu {
  position: absolute;
  z-index: 20;
  top: calc(100% + 0.45rem);
  right: 0;
  left: 0;
  max-height: 280px;
  padding: 0.35rem;
  overflow-y: auto;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  background: var(--surface);
  box-shadow: var(--shadow-lg);
}
.base-select__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.65rem 0.8rem;
  border-radius: var(--radius-sm);
  color: var(--text-soft);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s var(--ease);
}
.base-select__option:hover,
.base-select__option.is-selected {
  background: var(--primary-light);
  color: var(--primary-dark);
}
.base-select__option.is-selected {
  font-weight: 600;
}
.base-select__option i {
  color: var(--primary);
}
.base-select-menu-enter-active,
.base-select-menu-leave-active {
  transition:
    opacity 0.2s var(--ease),
    transform 0.2s var(--ease);
  transform-origin: top center;
}
.base-select-menu-enter-from,
.base-select-menu-leave-to {
  opacity: 0;
  transform: translateY(-0.35rem) scaleY(0.98);
}
.base-select.is-disabled {
  opacity: 0.65;
}
.base-select.is-disabled .base-select__trigger {
  cursor: not-allowed;
}
</style>
