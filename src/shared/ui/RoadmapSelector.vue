<template>
  <section
    class="flex min-h-[72px] flex-col gap-3 bg-[#f7faff] px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-10"
    aria-labelledby="roadmap-selector-title"
  >
    <p id="roadmap-selector-title" class="shrink-0 text-xs font-medium text-slate-500">적용 대상</p>

    <div class="relative w-full sm:w-[240px]">
      <img
        src="@/assets/icons/roadmap.svg"
        alt=""
        class="pointer-events-none absolute left-3.5 top-1/2 z-10 size-4 -translate-y-1/2"
      />
      <select
        :value="selectedGoalId ?? ''"
        class="h-10 w-full appearance-none rounded-xl border-2 border-primary bg-white py-0 pl-10 pr-10 text-xs font-bold text-[#0a192f] outline-none transition hover:bg-primary/[0.03] focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400"
        :disabled="disabled || goals.length === 0"
        aria-label="로드맵 선택"
        @change="handleChange"
      >
        <option v-if="goals.length === 0" value="">
          {{ disabled ? '로드맵을 불러오는 중이에요' : '선택 가능한 로드맵이 없어요' }}
        </option>
        <option v-for="goal in goals" :key="goal.goalId" :value="goal.goalId">
          {{ goal.goalName }} 로드맵
        </option>
      </select>
      <img
        src="@/assets/icons/chevron-down.svg"
        alt=""
        class="pointer-events-none absolute right-3.5 top-1/2 size-3.5 -translate-y-1/2"
      />
    </div>

    <p
      v-if="helperText"
      class="w-fit rounded-full bg-[#e7f1ff] px-3 py-1.5 text-[11px] font-medium text-primary"
    >
      {{ helperText }}
    </p>

    <p v-if="trailingText" class="text-[11px] font-medium text-slate-400 sm:ml-auto sm:shrink-0">
      {{ trailingText }}
    </p>
  </section>
</template>

<script setup>
const props = defineProps({
  goals: {
    type: Array,
    default: () => [],
  },
  selectedGoalId: {
    type: [Number, String],
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  helperText: {
    type: String,
    default: '',
  },
  trailingText: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:selectedGoalId', 'change'])

function handleChange(event) {
  const rawValue = event.target.value
  const matchedGoal = props.goals.find((goal) => String(goal.goalId) === rawValue)
  const goalId = matchedGoal?.goalId ?? null

  emit('update:selectedGoalId', goalId)
  emit('change', matchedGoal ?? null)
}
</script>
