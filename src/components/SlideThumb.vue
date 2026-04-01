<!-- src/components/SlideThumb.vue -->
<template>
  <div
      class="relative rounded-md cursor-pointer select-none"
      :class="active ? 'ring-2 ring-primary' : 'ring-1 ring-gray-300'"
      @click="$emit('select', index)"
  >
    <SlidePreview
        :lyrics="lyrics"
        :settings="settings"
        :bgDataUrl="bgDataUrl"
    />

    <!-- 슬라이드 번호 -->
    <span class="absolute bottom-1 left-1 text-[10px] text-white drop-shadow">
      {{ index + 1 }}
    </span>
  </div>
</template>

<script setup>
import SlidePreview from '@/components/SlidePreview.vue'

defineProps({
  index: Number,
  lyrics: String,
  active: Boolean,
  settings: Object,
  bgDataUrl: {type: String, default: null},
})
defineEmits(['select'])
</script>
