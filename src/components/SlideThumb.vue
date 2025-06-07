<!-- src/components/SlideThumb.vue -->
<template>
  <div
      class="relative w-full aspect-video rounded-md overflow-hidden cursor-pointer select-none"
      :class="active ? 'ring-2 ring-primary' : 'ring-1 ring-gray-300'"
      @click="emit('select', index)"
  >
    <!-- ── 배경 ───────────────────────────── -->
    <div class="absolute inset-0" :style="bgStyle" />

    <!-- ── 가사 텍스트 ────────────────────── -->
    <p
        class="absolute left-1/2 -translate-x-1/2 whitespace-pre-line leading-tight"
        :style="textStyle"
        v-html="htmlLyrics"
    />

    <!-- ── 슬라이드 번호 ──────────────────── -->
    <span class="absolute bottom-1 left-1 text-[10px] text-white drop-shadow">
      {{ index + 1 }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

/* ---------- props / emits (JS) ------------------------------ */
const props = defineProps({
  index: Number,
  lyrics: String,
  active: Boolean,
  settings: Object,   // Pinia에서 넘어오는 설정 객체
  bgDataUrl: { type: String, default: null },
})
const emit = defineEmits(['select']);

/* ---------- 위치 비율(top %) 계산 --------------------------- */
const topRatio = computed(() => {
  const h = props.settings.canvasHeight
  return h ? props.settings.positionY / h : 0.2        // 기본 20 %
})

/* ---------- 배경 스타일 ------------------------------------- */
const bgStyle = computed(() => {
  const s = props.settings
  if (s.isBgImg && props.bgDataUrl) {
    return {
      backgroundImage: `url(${props.bgDataUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }
  return { backgroundColor: s.bgColor }
})

/* ---------- 텍스트 스타일 & 내용 ---------------------------- */
const textStyle = computed(() => {
  const s = props.settings
  return {
    top: topRatio.value * 100 + '%',            // ex) 20 %
    color: s.textColor,
    fontSize: s.fontSize * 0.25 + 'px',         // 메인 대비 1/4
    fontWeight: s.isTextBold ? 'bold' : 'normal',
    fontFamily: s.fontFamily,
    textAlign: s.textAlign,
    padding: '2px',
  }
})
const htmlLyrics = computed(() => props.lyrics.replace(/\n/g, '<br/>'))
</script>
