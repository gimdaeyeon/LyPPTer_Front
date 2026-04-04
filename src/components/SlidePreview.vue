<!-- src/components/SlidePreview.vue -->
<template>
  <div
      ref="root"
      class="relative w-full aspect-video overflow-hidden rounded-md"
      @click="onBgClick"
  >
    <!-- 배경 -->
    <div class="absolute inset-0" :style="bgStyle"/>

    <!-- 스냅 가이드라인 -->
    <SlideSnapGuides
        v-if="interactive"
        :snapX="snapGuides.snapX.value"
        :snapY="snapGuides.snapY.value"
        :isDragging="isDragging"
    />

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
      <!-- 리사이즈 핸들 8방향 -->
      <template v-if="isSelected && !isEditing">
        <div v-for="h in RESIZE_HANDLES" :key="h.dir"
             class="resize-handle"
             :style="h.style"
             :class="h.cursor"
             @pointerdown.stop="(e) => onResizePointerDown(e, h.dir)"
        />
      </template>

      <!-- 가사 텍스트 -->
      <p
          ref="textEl"
          class="whitespace-pre-line w-full"
          :style="textContentStyle"
          :contenteditable="isEditing"
          @blur="onEditBlur"
          @input="onEditInput"
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
import {computed, onMounted, onUnmounted, ref, useTemplateRef, watch} from 'vue'
import {SLIDE_H, SLIDE_W, PT_PER_INCH} from '@/utils/pptUnits.js'
import {useTextBoxDrag} from '@/composables/useTextBoxDrag.js'
import {useTextBoxResize} from '@/composables/useTextBoxResize.js'
import {useSnapGuides} from '@/composables/useSnapGuides.js'
import {useInlineEdit} from '@/composables/useInlineEdit.js'
import {loadFontByName} from '@/composables/useFontLoader.js'
import {fontFamilies} from '@/utils/fontFamily.js'
import {RESIZE_HANDLES} from '@/utils/constants.js'
import SlideSnapGuides from '@/components/SlideSnapGuides.vue'

const props = defineProps({
  lyrics: String,
  settings: Object,
  bgDataUrl: {type: String, default: null},
  interactive: {type: Boolean, default: false},
})

const emit = defineEmits([
  'update:positionX', 'update:positionY',
  'update:textBoxWidth', 'update:textBoxHeight',
  'update:lyrics',
  'snapshot',
])

/* ---------- 선택 상태 ---------------------------------------------------- */
const isSelected = ref(false)

function onBgClick() {
  if (!props.interactive) return
  isSelected.value = false
  isEditing.value = false
}

function onKeydown(e) {
  if (e.key === 'Escape' && props.interactive) {
    if (isEditing.value) {
      isEditing.value = false
    } else if (isSelected.value) {
      isSelected.value = false
    }
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

function onBoxClick() {
  isSelected.value = true
}

/* ---------- 인라인 편집 (useInlineEdit) ---------------------------------- */
const textEl = useTemplateRef('textEl')
const {
  isEditing, htmlLyrics,
  onBoxDblClick, onEditInput, onEditBlur, onEditKeydown,
} = useInlineEdit(textEl, props, emit)

/* ---------- 컨테이너 높이 측정 (폰트 스케일링용) ----------------------- */
const root = useTemplateRef('root')
const containerHeight = ref(1)

function updateHeight() {
  containerHeight.value = root.value?.clientHeight || 1
}

let ro
onMounted(() => {
  updateHeight()
  ro = new ResizeObserver(updateHeight)
  ro.observe(root.value)
})

/* ---------- 스냅 가이드 ----------------------------------------------- */
const snapGuides = useSnapGuides()

/* ---------- 드래그 ---------------------------------------------------- */
const {isDragging, onPointerDown: dragPointerDown, cleanup: cleanupDrag} = useTextBoxDrag(
    root,
    (newX, newY) => {
      emit('update:positionX', newX)
      emit('update:positionY', newY)
    },
    () => ({width: props.settings.textBoxWidth, height: props.settings.textBoxHeight}),
    snapGuides
)

function onBoxPointerDown(e) {
  if (!isSelected.value || isEditing.value) return
  emit('snapshot')
  dragPointerDown(e, props.settings.positionX, props.settings.positionY)
}

/* ---------- 리사이즈 -------------------------------------------------- */
const {isResizing, onPointerDown: resizePointerDown, cleanup: cleanupResize} = useTextBoxResize(
    root,
    ({width, height, x, y}) => {
      emit('update:textBoxWidth', width)
      emit('update:textBoxHeight', height)
      emit('update:positionX', x)
      emit('update:positionY', y)
    }
)

function onResizePointerDown(e, dir) {
  emit('snapshot')
  resizePointerDown(e, dir, {
    width: props.settings.textBoxWidth,
    height: props.settings.textBoxHeight,
    x: props.settings.positionX,
    y: props.settings.positionY,
  })
}

/* ---------- 정리 ------------------------------------------------------- */
onUnmounted(() => {
  ro?.disconnect()
  cleanupDrag()
  cleanupResize()
})

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
    overflow: 'hidden',
  }
})
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
