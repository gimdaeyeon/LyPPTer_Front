<template>
  <div class="flex border-b border-gray-200">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      class="flex-1 py-3 text-center text-sm font-semibold border-b-2 transition-colors"
      :class="modelValue === tab.key
        ? 'border-b-primary text-[#1C160C]'
        : 'border-transparent text-gray-400'"
      @click="$emit('update:modelValue', tab.key)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, required: true },
})

defineEmits(['update:modelValue'])

const tabs = [
  { key: 'preview', label: 'Preview' },
  { key: 'lyrics', label: 'Lyrics' },
  { key: 'slides', label: 'Slides' },
]
</script>
