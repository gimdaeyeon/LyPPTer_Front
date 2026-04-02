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
    <template v-if="interactive && isDragging">
      <div v-for="line in snapGuideLines" :key="line.key" :style="line.style"/>
    </template>

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
        <div v-for="h in handles" :key="h.dir"
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
import {computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch} from 'vue'
import {SLIDE_H, SLIDE_W, PT_PER_INCH} from '@/utils/pptUnits.js'
import {useTextBoxDrag} from '@/composables/useTextBoxDrag.js'
import {useTextBoxResize} from '@/composables/useTextBoxResize.js'
import {useSnapGuides} from '@/composables/useSnapGuides.js'
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
  'update:textBoxWidth', 'update:textBoxHeight',
  'update:lyrics',
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
    if (textEl.value) {
      // v-html의 <br/> DOM 대신 순수 텍스트로 설정해 Enter 동작 일관성 확보
      textEl.value.innerText = props.lyrics || ''
      textEl.value.focus()
      // 커서를 텍스트 끝으로 이동
      const range = document.createRange()
      const sel = window.getSelection()
      range.selectNodeContents(textEl.value)
      range.collapse(false)
      sel.removeAllRanges()
      sel.addRange(range)
    }
  })
}

/* ---------- 인라인 편집 ------------------------------------------------ */
const textEl = useTemplateRef('textEl')

// contenteditable 끝에 브라우저가 자동 추가하는 trailing \n 제거
function getEditedText() {
  const text = textEl.value?.innerText || ''
  // 연속 줄바꿈을 단일로 치환 (슬라이드 구분자 \n\n 혼입 방지) + trailing \n 제거
  return text.replace(/\n{2,}/g, '\n').replace(/\n$/, '')
}

function onEditInput() {
  if (!isEditing.value) return
  // v-html 재렌더링을 막기 위해 localLyrics는 건드리지 않고 emit만
  emit('update:lyrics', getEditedText())
}

function onEditBlur() {
  if (!isEditing.value) return
  const newText = getEditedText()
  localLyrics.value = newText
  emit('update:lyrics', newText)
  isEditing.value = false
}

function onEditKeydown(e) {
  if (e.key === 'Escape') {
    e.preventDefault()
    textEl.value?.blur()
  } else if (e.key === 'Enter') {
    // 브라우저 기본 Enter 동작(<div>/<br><br> 삽입)을 막고 \n 직접 삽입
    e.preventDefault()
    // 슬라이드 구분자(\n\n)와 충돌 방지: 커서 앞뒤에 이미 \n이 있으면 차단
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0)
      const node = range.startContainer
      const offset = range.startOffset
      if (node.nodeType === Node.TEXT_NODE) {
        const before = offset > 0 ? node.textContent[offset - 1] : ''
        const after = offset < node.textContent.length ? node.textContent[offset] : ''
        if (before === '\n' || after === '\n') return
      }
    }
    document.execCommand('insertText', false, '\n')
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

/* ---------- 스냅 가이드 ----------------------------------------------- */
const snapGuides = useSnapGuides()

const snapGuideLines = computed(() => {
  const lines = []
  if (snapGuides.snapX.value !== null) {
    lines.push({
      key: 'x',
      style: {
        position: 'absolute', top: '0', bottom: '0',
        left: (snapGuides.snapX.value / SLIDE_W * 100) + '%',
        width: '0',
        borderLeft: '1px dashed rgba(59,130,246,0.75)',
        pointerEvents: 'none',
        zIndex: '20',
      },
    })
  }
  if (snapGuides.snapY.value !== null) {
    lines.push({
      key: 'y',
      style: {
        position: 'absolute', left: '0', right: '0',
        top: (snapGuides.snapY.value / SLIDE_H * 100) + '%',
        height: '0',
        borderTop: '1px dashed rgba(59,130,246,0.75)',
        pointerEvents: 'none',
        zIndex: '20',
      },
    })
  }
  return lines
})

/* ---------- 드래그 ---------------------------------------------------- */
const {isDragging, onPointerDown: dragPointerDown} = useTextBoxDrag(
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
  dragPointerDown(e, props.settings.positionX, props.settings.positionY)
}

/* ---------- 리사이즈 -------------------------------------------------- */
const {isResizing, onPointerDown: resizePointerDown} = useTextBoxResize(
    root,
    ({width, height, x, y}) => {
      emit('update:textBoxWidth', width)
      emit('update:textBoxHeight', height)
      emit('update:positionX', x)
      emit('update:positionY', y)
    }
)

function onResizePointerDown(e, dir) {
  resizePointerDown(e, dir, {
    width: props.settings.textBoxWidth,
    height: props.settings.textBoxHeight,
    x: props.settings.positionX,
    y: props.settings.positionY,
  })
}

/* ---------- 8방향 핸들 정의 ------------------------------------------- */
const handles = [
  // 변 (상하좌우)
  {dir: 'n', style: {top: 0, left: '50%', transform: 'translate(-50%, -50%)'}, cursor: 'cursor-ns-resize'},
  {dir: 's', style: {bottom: 0, left: '50%', transform: 'translate(-50%, 50%)'}, cursor: 'cursor-ns-resize'},
  {dir: 'w', style: {left: 0, top: '50%', transform: 'translate(-50%, -50%)'}, cursor: 'cursor-ew-resize'},
  {dir: 'e', style: {right: 0, top: '50%', transform: 'translate(50%, -50%)'}, cursor: 'cursor-ew-resize'},
  // 모서리
  {dir: 'nw', style: {top: 0, left: 0, transform: 'translate(-50%, -50%)'}, cursor: 'cursor-nwse-resize'},
  {dir: 'ne', style: {top: 0, right: 0, transform: 'translate(50%, -50%)'}, cursor: 'cursor-nesw-resize'},
  {dir: 'sw', style: {bottom: 0, left: 0, transform: 'translate(-50%, 50%)'}, cursor: 'cursor-nesw-resize'},
  {dir: 'se', style: {bottom: 0, right: 0, transform: 'translate(50%, 50%)'}, cursor: 'cursor-nwse-resize'},
]

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

/* ---------- 로컬 가사 (편집 중 v-html 재렌더링 방지) ------------------- */
const localLyrics = ref(props.lyrics || '')

watch(() => props.lyrics, (val) => {
  if (!isEditing.value) {
    localLyrics.value = val || ''
  }
})

/* ---------- 줄바꿈 유지 ------------------------------------------------ */
const htmlLyrics = computed(() =>
    (localLyrics.value || '').replace(/\n/g, '<br/>')
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
