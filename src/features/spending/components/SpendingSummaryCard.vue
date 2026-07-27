<template>
  <article
    class="flex min-h-[116px] flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-white px-5 py-4 lg:min-h-[124px] lg:px-6"
  >
    <div>
      <p class="text-sm font-medium text-[#64748B]">
        {{ title }}
      </p>

      <div class="mt-2 flex items-end gap-1">
        <strong
          class="text-[26px] font-bold leading-none tracking-[-0.03em]"
          :class="valueColorClass"
        >
          {{ formattedValue }}
        </strong>

        <span class="pb-0.5 text-sm font-medium text-[#64748B]">
          {{ unit }}
        </span>
      </div>
    </div>

    <div v-if="hasProgress" class="mt-4">
      <div class="mb-2 flex items-center justify-between gap-3">
        <span class="text-xs text-[#64748B]">
          {{ progressLabel }}
        </span>

        <span class="text-xs font-semibold text-[#0066FF]">
          {{ progressText }}
        </span>
      </div>

      <div
        class="h-1.5 overflow-hidden rounded-full bg-[#EAF2FF]"
        role="progressbar"
        :aria-valuenow="normalizedProgress"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-label="progressLabel"
      >
        <div
          class="h-full rounded-full bg-[#0066FF] transition-[width] duration-300"
          :style="{ width: `${normalizedProgress}%` }"
        />
      </div>
    </div>

    <p v-else-if="description" class="mt-3 text-xs leading-5 text-[#64748B]">
      {{ descriptionPrefix }}

      <strong v-if="descriptionHighlight" class="font-semibold" :class="descriptionColorClass">
        {{ descriptionHighlight }}
      </strong>
    </p>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [Number, String],
    required: true,
  },
  unit: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  descriptionHighlight: {
    type: String,
    default: '',
  },
  tone: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'positive', 'warning'].includes(value),
  },
  progress: {
    type: Number,
    default: null,
  },
  progressLabel: {
    type: String,
    default: '목표 달성 진행률',
  },
  progressText: {
    type: String,
    default: '',
  },
})

const formattedValue = computed(() => {
  if (typeof props.value !== 'number') {
    return props.value
  }

  return new Intl.NumberFormat('ko-KR').format(props.value)
})

const hasProgress = computed(() => props.progress !== null)

const normalizedProgress = computed(() => {
  if (!hasProgress.value) {
    return 0
  }

  return Math.min(Math.max(props.progress, 0), 100)
})

const descriptionPrefix = computed(() => {
  if (!props.descriptionHighlight) {
    return props.description
  }

  return props.description.replace(props.descriptionHighlight, '').trim()
})

const valueColorClass = computed(() => {
  const toneClasses = {
    default: 'text-[#0A192F]',
    primary: 'text-[#0066FF]',
    positive: 'text-[#10B981]',
    warning: 'text-[#F59E0B]',
  }

  return toneClasses[props.tone]
})

const descriptionColorClass = computed(() => {
  const toneClasses = {
    default: 'text-[#0A192F]',
    primary: 'text-[#0066FF]',
    positive: 'text-[#10B981]',
    warning: 'text-[#F59E0B]',
  }

  return toneClasses[props.tone]
})
</script>
