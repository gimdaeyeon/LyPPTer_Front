<!-- src/components/SlidePreview.vue -->
<template>
  <div
      ref="root"
      class="relative w-full aspect-video overflow-hidden rounded-md"
      @click="onBgClick"
  >
    <!-- 배경 -->
    <div class="absolute inset-0" :style="bgStyle"/>

    <!-- 텍스트박스 래퍼 (interactive 모드) -->
    <div
        v-if="interactive"
        class="absolute -translate-x-1/2"
        :style="[textPositionStyle, boxStyle]"
        :class="wrapperClass"
        @click.stop="onBoxClick"
        @dblclick.stop="onBoxDblClick"
        @pointerdown="onBoxPointerDown"
    >
      <!-- 리사이즈 핸들 (좌) -->
      <div
          v-if="isSelected && !isEditing"
          class="resize-handle left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 cursor-ew-resize"
          @pointerdown.stop="(e) => onResizePointerDown(e, 'w')"
      />
      <!-- 리사이즈 핸들 (우) -->
      <div
          v-if="isSelected && !isEditing"
          class="resize-handle right-0 translate-x-1/2 top-1/2 -translate-y-1/2 cursor-ew-resize"
          @pointerdown.stop="(e) => onResizePointerDown(e, 'e')"
      />

      <!-- 가사 텍스트 -->
      <p
          ref="textEl"
          class="whitespace-pre-line w-full"
          :style="textContentStyle"
          :contenteditable="isEditing"
          @blur="onEditBlur"
          @keydown="onEditKeydown"
          v-html="htmlLyrics"
      />
    </div>

    <!-- 읽기 전용 모드 (썸네일 등) -->
    <p
        v-else
        class="absolute -translate-x-1/2 whitespace-pre-line"
        :style="[textPositionStyle, boxStyle, textContentStyle]"
        v-html="htmlLyrics"
    />
  </div>
</template>

<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch} from 'vue'
import {SLIDE_H, SLIDE_W, PT_PER_INCH} from '@/utils/pptUnits.js'
import {useTextBoxDrag} from '@/composables/useTextBoxDrag.js'
import {useTextBoxResize} from '@/composables/useTextBoxResize.js'
import {loadFontByName} from '@/composables/useFontLoader.js'
import {fontFamilies} from '@/utils/fontFamily.js'

const props = defineProps({
  lyrics: String,
  settings: Object,
  bgDataUrl: {type: String, default: null},
  interactive: {type: Boolean, default: false},
})

const emit = defineEmits([
  'update:positionX', 'update:positionY',
  'update:textBoxWidth', 'update:lyrics',
])

/* ---------- 선택/편집 상태 -------------------------------------------- */
const isSelected = ref(false)
const isEditing = ref(false)

function onBgClick() {
  if (!props.interactive) return
  isSelected.value = false
  isEditing.value = false
}

function onBoxClick() {
  isSelected.value = true
}

function onBoxDblClick() {
  isEditing.value = true
  nextTick(() => {
    textEl.value?.focus()
  })
}

/* ---------- 인라인 편집 ------------------------------------------------ */
const textEl = useTemplateRef('textEl')

function onEditBlur() {
  if (!isEditing.value) return
  const newText = textEl.value?.innerText?.trim() || ''
  emit('update:lyrics', newText)
  isEditing.value = false
}

function onEditKeydown(e) {
  if (e.key === 'Escape') {
    e.preventDefault()
    textEl.value?.blur()
  }
}

/* ---------- 컨테이너 높이 측정 (폰트 스케일링용) ----------------------- */
const root = useTemplateRef('root')
const containerHeight = ref(1)

function updateHeight() {
  containerHeight.value = root.value?.clientHeight || 1
}

onMounted(() => {
  updateHeight()
  const ro = new ResizeObserver(updateHeight)
  ro.observe(root.value)
  onUnmounted(() => ro.disconnect())
})

/* ---------- 드래그 ---------------------------------------------------- */
const {isDragging, onPointerDown: dragPointerDown} = useTextBoxDrag(
    root,
    (newX, newY) => {
      emit('update:positionX', newX)
      emit('update:positionY', newY)
    }
)

function onBoxPointerDown(e) {
  if (!isSelected.value || isEditing.value) return
  dragPointerDown(e, props.settings.positionX, props.settings.positionY)
}

/* ---------- 리사이즈 -------------------------------------------------- */
const {isResizing, onPointerDown: resizePointerDown} = useTextBoxResize(
    root,
    (newWidth, newX) => {
      emit('update:textBoxWidth', newWidth)
      emit('update:positionX', newX)
    }
)

function onResizePointerDown(e, dir) {
  resizePointerDown(e, dir, props.settings.textBoxWidth, props.settings.positionX)
}

/* ---------- 래퍼 클래스 ----------------------------------------------- */
const wrapperClass = computed(() => {
  if (!isSelected.value) return 'cursor-default'
  if (isEditing.value) return 'ring-2 ring-blue-400 cursor-text'
  if (isDragging.value) return 'ring-1 ring-dashed ring-blue-400 cursor-grabbing'
  return 'ring-1 ring-dashed ring-blue-400 cursor-grab'
})

/* ---------- 폰트 자동 로드 --------------------------------------------- */
watch(() => props.settings?.fontFamily, (name) => {
  if (name) loadFontByName(name, fontFamilies)
}, {immediate: true})

/* ---------- 배경 스타일 ------------------------------------------------ */
const bgStyle = computed(() => {
  const s = props.settings
  if (s.isBgImg && props.bgDataUrl) {
    return {
      backgroundImage: `url(${props.bgDataUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }
  return {backgroundColor: s.bgColor}
})

/* ---------- 텍스트 위치 스타일 ----------------------------------------- */
const textPositionStyle = computed(() => {
  const s = props.settings
  const topPercent = (s.positionY / SLIDE_H) * 100
  const leftPercent = (s.positionX / SLIDE_W) * 100
  return {
    top: topPercent + '%',
    left: leftPercent + '%',
  }
})

/* ---------- 텍스트 콘텐츠 스타일 --------------------------------------- */
const textContentStyle = computed(() => {
  const s = props.settings
  const fontPx = s.fontSize * (containerHeight.value / (SLIDE_H * PT_PER_INCH))
  return {
    color: s.textColor,
    fontSize: `${fontPx}px`,
    fontWeight: s.isTextBold ? 'bold' : 'normal',
    fontFamily: s.fontFamily,
    textAlign: s.textAlign,
    lineHeight: s.lineSpacing,
    padding: '2px',
  }
})

/* ---------- 텍스트박스 크기 스타일 ------------------------------------- */
const boxStyle = computed(() => {
  const s = props.settings
  const widthPercent = (s.textBoxWidth / SLIDE_W) * 100
  return {
    width: widthPercent + '%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
  }
})

/* ---------- 줄바꿈 유지 ------------------------------------------------ */
const htmlLyrics = computed(() =>
    (props.lyrics || '').replace(/\n/g, '<br/>')
)
</script>

<style scoped>
.resize-handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: white;
  border: 1px solid #9ca3af;
  border-radius: 1px;
  z-index: 10;
}

.ring-dashed {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
  outline: 1px dashed rgb(96 165 250);
  outline-offset: 2px;
}
</style>
