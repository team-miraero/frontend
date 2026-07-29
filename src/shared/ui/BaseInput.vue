<!-- 공용 라벨+입력 컴포넌트: 우측 상단 action(예: 비밀번호 찾기), 입력창 내부 우측 suffix(예: 아이콘 버튼) 슬롯, 에러 메시지 지원 -->
<template>
  <div>
    <div class="mb-1.5 flex items-center justify-between">
      <label :for="id" class="text-sm font-medium text-gray-700">{{ label }}</label>
      <slot name="action" />
    </div>
    <div class="relative">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        class="w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1"
        :class="
          error
            ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
            : 'border-gray-200 focus:border-primary focus:ring-primary'
        "
        @input="emit('update:modelValue', $event.target.value)"
        @blur="emit('blur', $event)"
      />
      <div v-if="$slots.suffix" class="absolute inset-y-0 right-3 flex items-center">
        <slot name="suffix" />
      </div>
    </div>
    <p v-if="error" class="mt-1.5 text-xs text-red-500">{{ error }}</p>
  </div>
</template>

<script setup>
defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  modelValue: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'blur'])
</script>
