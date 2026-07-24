<template>
  <div
    class="relative cursor-pointer rounded-2xl border-2 p-6 transition-all duration-200 hover:shadow-md"
    :class="[
      isSelected
        ? 'border-blue-600 bg-blue-50 shadow-sm'
        : 'border-gray-200 bg-white hover:border-blue-200'
    ]"
    @click="$emit('select')"
  >
    <!-- 체크 아이콘 (선택 시 노출) -->
    <div
      v-if="isSelected"
      class="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="h-4 w-4"
      >
        <path
          fill-rule="evenodd"
          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
          clip-rule="evenodd"
        />
      </svg>
    </div>

    <!-- 카드 내용 -->
    <div class="mb-4 text-4xl">{{ icon }}</div>
    <h3 class="mb-2 text-lg font-bold text-gray-900">{{ title }}</h3>
    <p class="text-sm leading-relaxed text-gray-600">{{ description }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['select'])
</script>
