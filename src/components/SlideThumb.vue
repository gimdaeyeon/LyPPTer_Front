<!-- src/components/SlideThumb.vue -->
<template>
  <div
      ref="root"
      class="relative w-full aspect-video rounded-md overflow-hidden cursor-pointer select-none"
      :class="active ? 'ring-2 ring-primary' : 'ring-1 ring-gray-300'"
      @click="$emit('select', index)"
  >
    <!-- 배경 ---------------------------------------------------------------->
    <div class="absolute inset-0" :style="bgStyle" />

    <!-- 가사 텍스트 --------------------------------------------------------->
    <p
        class="absolute left-1/2 -translate-x-1/2 whitespace-pre-line leading-tight"
        :style="[textStyle, boxStyle]"
        v-html="htmlLyrics"
    />

    <!-- 슬라이드 번호 ------------------------------------------------------->
    <span class="absolute bottom-1 left-1 text-[10px] text-white drop-shadow">
      {{ index + 1 }}
    </span>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted, useTemplateRef} from 'vue'

/* ---------- props ------------------------------------------------------- */
const props = defineProps({
  index: Number,
  lyrics: String,
  active: Boolean,
  settings: Object,          // Pinia의 settings 객체
  bgDataUrl: { type: String, default: null },
})
defineEmits(['select'])

/* ---------- 1) 썸네일 실제 높이로 배율 계산 ----------------------------- */
const root = useTemplateRef('root')        // <div> 루트
const thumbScale = ref(0.25)  // 기본값 (마운트 후 즉시 갱신)

function updateScale() {
  const realH = root.value?.clientHeight || 1
  const canvasH = props.settings.canvasHeight || realH
  thumbScale.value = realH / canvasH
}

onMounted(() => {
  updateScale()

  /* 썸네일 크기가 반응형으로 변할 때도 다시 계산 */
  const ro = new ResizeObserver(updateScale)
  ro.observe(root.value)
  onUnmounted(() => ro.disconnect())
})

/* ---------- 2) 배경 스타일 --------------------------------------------- */
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

/* ---------- 3) 텍스트·박스 스타일 -------------------------------------- */
const textStyle = computed(() => {
  const s = props.settings
  return {
    top: (s.positionY / s.canvasHeight) * 100 + '%',
    color: s.textColor,
    fontSize: s.fontSize * thumbScale.value + 'px',
    fontWeight: s.isTextBold ? 'bold' : 'normal',
    fontFamily: s.fontFamily,
    textAlign: s.textAlign,
    padding: '2px',
  }
})

const boxStyle = computed(() => {
  const s = props.settings
  return {
    width: s.textBoxWidth * thumbScale.value + 'px',
    // height: s.textBoxHeight * thumbScale.value + 'px',
    // overflow: 'hidden',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
  }
})

/* ---------- 4) 줄바꿈 유지 -------------------------------------------- */
const htmlLyrics = computed(() => props.lyrics.replace(/\n/g, '<br/>'))
</script>
