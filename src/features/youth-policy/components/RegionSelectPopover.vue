<template>
  <div class="relative w-full">
    <button
      ref="triggerRef"
      type="button"
      class="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 outline-none transition-colors hover:border-primary/30 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/10"
      aria-haspopup="dialog"
      :aria-expanded="isOpen"
      aria-controls="region-select-dialog"
      @click="openPicker"
    >
      <span class="truncate">{{ displayValue }}</span>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        class="size-4 shrink-0 text-gray-400"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
      </svg>
    </button>

    <template v-if="isOpen">
      <button
        type="button"
        class="fixed inset-0 z-40 bg-black/25 sm:bg-transparent"
        aria-label="지역 선택 닫기"
        @click="closePicker"
      />

      <section
        id="region-select-dialog"
        ref="panelRef"
        role="dialog"
        aria-modal="true"
        aria-labelledby="region-select-title"
        class="fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col rounded-t-3xl bg-white p-5 shadow-[0_-16px_48px_rgba(15,23,42,0.16)] sm:absolute sm:inset-x-auto sm:bottom-auto sm:right-0 sm:top-[calc(100%+0.5rem)] sm:max-h-[520px] sm:w-[420px] sm:rounded-2xl sm:border sm:border-gray-200 sm:p-5 sm:shadow-[0_18px_48px_rgba(15,23,42,0.16)]"
      >
        <header class="flex items-center justify-between border-b border-gray-200 pb-4">
          <h2 id="region-select-title" class="text-lg font-black text-gray-900">지역 선택</h2>
          <button
            type="button"
            class="flex size-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
            aria-label="닫기"
            @click="closePicker"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="size-5"
            >
              <path stroke-linecap="round" d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div class="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
          <div class="grid gap-2 sm:grid-cols-2">
            <label
              v-for="(region, index) in regions"
              :key="region"
              class="flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 text-sm font-bold transition-colors"
              :class="
                draftRegion === region
                  ? 'border-primary/30 bg-[#f2f6ff] text-gray-900'
                  : 'border-transparent bg-[#f7f8fa] text-gray-600 hover:bg-gray-100'
              "
            >
              <input
                v-model="draftRegion"
                class="sr-only"
                type="radio"
                name="youth-policy-region"
                :value="region"
                :aria-describedby="`region-option-${index}`"
              />
              <span
                class="flex size-5 shrink-0 items-center justify-center rounded-full border bg-white"
                :class="draftRegion === region ? 'border-primary' : 'border-gray-300'"
                aria-hidden="true"
              >
                <span v-if="draftRegion === region" class="size-2.5 rounded-full bg-primary" />
              </span>
              <span :id="`region-option-${index}`">{{
                region === '전체' ? '지역 전체' : region
              }}</span>
            </label>
          </div>
        </div>

        <footer class="mt-5 flex justify-end border-t border-gray-100 pt-4">
          <button
            type="button"
            class="w-full rounded-xl bg-primary px-6 py-3 text-sm font-black text-white transition-colors hover:bg-blue-700 sm:w-auto"
            @click="applyRegion"
          >
            적용
          </button>
        </footer>
      </section>
    </template>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '전체' },
  regions: { type: Array, required: true },
})
const emit = defineEmits(['apply'])

const isOpen = ref(false)
const draftRegion = ref(props.modelValue)
const triggerRef = ref(null)
const panelRef = ref(null)

const displayValue = computed(() => (props.modelValue === '전체' ? '지역 전체' : props.modelValue))

watch(
  () => props.modelValue,
  (value) => {
    if (!isOpen.value) draftRegion.value = value
  }
)

async function openPicker() {
  draftRegion.value = props.modelValue
  isOpen.value = true
  await nextTick()
  panelRef.value?.querySelector('input:checked')?.focus()
}

function closePicker() {
  isOpen.value = false
  nextTick(() => triggerRef.value?.focus({ preventScroll: true }))
}

function applyRegion() {
  emit('apply', draftRegion.value)
  closePicker()
}

function handleKeydown(event) {
  if (isOpen.value && event.key === 'Escape') closePicker()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))
</script>
