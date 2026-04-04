<!-- src/components/SlideThumb.vue -->
<template>
  <div
      class="group relative rounded-md cursor-pointer select-none"
      :class="active ? 'ring-2 ring-primary' : 'ring-1 ring-gray-300'"
      draggable="true"
      @dragstart="$emit('dragstart', $event, index)"
      @dragover.prevent="$emit('dragover', $event, index)"
      @dragend="$emit('dragend')"
      @drop.prevent="$emit('drop', $event, index)"
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

    <!-- hover 시 액션 버튼 -->
    <div class="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
          @click.stop="$emit('duplicate', index)"
          class="w-5 h-5 flex items-center justify-center rounded bg-black/50 hover:bg-black/70 text-white text-[10px]"
          title="슬라이드 복제"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" class="w-2.5 h-2.5">
          <path d="M208 0H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48zM48 128h80v64H64V448H256V416h64v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48z"/>
        </svg>
      </button>
      <button
          v-if="canDelete"
          @click.stop="$emit('delete', index)"
          class="w-5 h-5 flex items-center justify-center rounded bg-black/50 hover:bg-red-600/80 text-white text-[10px]"
          title="슬라이드 삭제"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" class="w-2.5 h-2.5">
          <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
        </svg>
      </button>
    </div>
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
  canDelete: {type: Boolean, default: true},
})
defineEmits(['select', 'delete', 'duplicate', 'dragstart', 'dragover', 'dragend', 'drop'])
</script>
