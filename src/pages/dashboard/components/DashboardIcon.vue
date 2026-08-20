<template>
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" v-bind="$attrs">
    <template v-if="name === 'spark'">
      <path fill="currentColor" d="M13.7 2.8 5.3 13.1c-.5.7 0 1.7.9 1.7h4.3l-.7 5.4c-.1 1.1 1.2 1.6 1.9.7l7-9.3c.5-.7 0-1.7-.9-1.7h-4.2l1.9-6.3c.3-1.1-1.1-1.7-1.8-.8Z" />
      <path fill="#fff" fill-opacity=".35" d="m13.7 10 1.8-6.3c.2-.6-.2-1-.7-1.1l-4.2 8.6c-.3.7.1 1.3.8 1.3h3.4l-4.6 7.9c.2.8 1.1 1 1.6.4l7-9.3c.5-.7 0-1.6-.9-1.6h-4.2Z" />
    </template>
    <template v-else-if="name === 'calendar-check'">
      <rect x="3" y="4.5" width="18" height="16.5" rx="4" fill="currentColor" />
      <path d="M3 9h18" stroke="#fff" stroke-opacity=".65" stroke-width="1.7" />
      <path d="M8 3v3M16 3v3" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" />
      <path d="m8.2 15 2.3 2.2 5.2-5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </template>
    <template v-else-if="name === 'flag'">
      <path fill="currentColor" d="M5 3.2A1.2 1.2 0 0 1 6.2 2h10.5c1 0 1.6 1.1 1 1.9l-2 2.8 2 2.8c.6.8 0 1.9-1 1.9H7.4V21a1.2 1.2 0 0 1-2.4 0V3.2Z" />
      <path fill="#fff" fill-opacity=".28" d="M7.4 4.4h7.2l-1.5 2.3 1.5 2.3H7.4V4.4Z" />
    </template>
    <template v-else-if="name === 'trend'">
      <path fill="currentColor" fill-opacity=".2" d="M3 17.7 9 11l4 3 7-8v12.5A2.5 2.5 0 0 1 17.5 21h-12A2.5 2.5 0 0 1 3 18.5v-.8Z" />
      <path d="m4 16 5-5 4 3 7-8M15.5 6H20v4.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
    </template>
    <template v-else-if="name === 'target'">
      <circle cx="11.5" cy="12.5" r="8.5" fill="currentColor" fill-opacity=".2" />
      <circle cx="11.5" cy="12.5" r="5.2" stroke="currentColor" stroke-width="2" />
      <circle cx="11.5" cy="12.5" r="2" fill="currentColor" />
      <path d="m13 11 6.5-6.5M16.5 4.5h3v3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </template>
    <template v-else-if="name === 'check'">
      <circle cx="12" cy="12" r="9.5" fill="currentColor" />
      <path d="m7.5 12 3 3 6.2-6.3" stroke="#fff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" />
    </template>
    <template v-else-if="name === 'piggy-bank'">
      <path fill="currentColor" d="M4.1 10.2C5 7.4 7.7 5.5 11 5.5h2.3c.7-1.2 2-2 3.7-2v4c.9.7 1.5 1.6 1.8 2.6H21v4h-2.5c-.5 1.2-1.4 2.2-2.5 2.9v2.5h-3V18H8v1.5H5V17a7 7 0 0 1-2.8-4.5H1v-3h2.1l1 0v.7Z" />
      <path d="M8 7c1.6-.7 3.5-.8 5.2-.3" stroke="#fff" stroke-opacity=".55" stroke-width="1.6" stroke-linecap="round" />
      <circle cx="15.8" cy="10" r="1" fill="#fff" />
    </template>
    <template v-else-if="name === 'bank'">
      <path fill="currentColor" d="M11.2 2.4a1.5 1.5 0 0 1 1.6 0l8 5.2c.8.5.4 1.8-.5 1.8H3.7c-.9 0-1.3-1.2-.5-1.8l8-5.2ZM4 11h3v6H4v-6Zm6.5 0h3v6h-3v-6Zm6.5 0h3v6h-3v-6ZM2.5 19h19v3h-19v-3Z" />
      <circle cx="12" cy="6.2" r="1.3" fill="#fff" fill-opacity=".65" />
    </template>
    <template v-else-if="name === 'loan'">
      <rect x="2" y="5" width="20" height="15" rx="4" fill="currentColor" />
      <path fill="#fff" fill-opacity=".65" d="M2 8.5h20v3H2z" />
      <circle cx="17.5" cy="16" r="2.2" fill="#fff" fill-opacity=".82" />
      <path d="m16.5 16 1 1 1.8-2" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" />
    </template>
    <template v-else-if="name === 'clock'">
      <circle cx="12" cy="13" r="9" fill="currentColor" />
      <path d="M9 2h6M12 8.5V13l3 2" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M12 8.5V13l3 2" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="12" cy="13" r="1.1" fill="#fff" />
    </template>
    <template v-else-if="name === 'lock'">
      <rect x="3" y="9" width="18" height="13" rx="4" fill="currentColor" />
      <path d="M7.5 9V6.8a4.5 4.5 0 0 1 9 0V9" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" />
      <circle cx="12" cy="15" r="2" fill="#fff" fill-opacity=".82" />
      <rect x="11.2" y="16" width="1.6" height="2.4" rx=".8" fill="#fff" fill-opacity=".82" />
    </template>
    <template v-else-if="name === 'report-ready'">
      <path fill="currentColor" d="M5 2h11l4 4v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
      <path fill="#fff" fill-opacity=".55" d="M16 2v5h4" />
      <path d="m7.5 14 2.5 2.5 6-6" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </template>
    <template v-else-if="name === 'refresh'">
      <circle cx="12" cy="12" r="9.5" fill="currentColor" fill-opacity=".2" />
      <path d="M18.5 9A7 7 0 1 0 19 14M18.5 5.5V9H15" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
    </template>
    <template v-else-if="name === 'plus'">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path d="M12 7v10M7 12h10" stroke="#fff" stroke-width="2.2" stroke-linecap="round" />
    </template>
  </svg>
</template>
<script setup>
defineOptions({ inheritAttrs: false })
defineProps({ name: { type: String, required: true } })
</script>
