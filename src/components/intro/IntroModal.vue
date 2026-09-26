<!-- src/components/intro/IntroModal.vue -->
<!-- 첫 방문 인트로 팝업: 사용법 4단계를 모션으로 보여준다 (App.vue에서 열릴 때만 지연 로드) -->
<template>
  <div class="backdrop" :class="{closing}" @click.self="close">
    <div ref="dialog" class="dialog" role="dialog" aria-modal="true" aria-labelledby="intro-title" tabindex="-1">
      <h2 id="intro-title" class="sr-only">Lyppter 사용법</h2>
      <ol class="sr-only">
        <li>가사를 붙여넣으면 빈 줄마다 슬라이드로 나뉩니다.</li>
        <li>글꼴과 배경을 바꾸면 모든 슬라이드에 한 번에 적용됩니다.</li>
        <li>텍스트 위치는 드래그로 옮기고 스냅 가이드로 정렬합니다.</li>
        <li>Export 버튼을 누르면 PPT 파일로 저장됩니다.</li>
      </ol>

      <!-- 스토리형 단계 진행바 (누르면 해당 단계로 이동) -->
      <div class="bars">
        <button v-for="(_, i) in INTRO_STEPS" :key="i" :aria-label="`${i + 1}단계 보기`" @click="goStep(i)">
          <i><b :ref="el => (barFills[i] = el)"/></i>
        </button>
      </div>
      <button class="close-btn" aria-label="닫기" @click="close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>

      <div ref="stageBox" class="stage-box">
        <IntroStage ref="stage" :style="{transform: `scale(${scale})`}"/>
        <!-- 스토리처럼 좌우를 눌러 섹션 이동 (왼쪽 1/3은 이전, 나머지는 다음) -->
        <button class="tap tap-prev" aria-label="이전 단계" @click="prevStep">
          <span class="tap-hint">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
          </span>
        </button>
        <button class="tap tap-next" aria-label="다음 단계" :disabled="ended" @click="nextStep">
          <span class="tap-hint">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>
          </span>
        </button>
      </div>

      <div class="foot">
        <button class="sub-btn" @click="onSubAction">{{ subLabel }}</button>
        <button class="start-btn" :class="{pulse: ended}" @click="close">
          시작하기
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onBeforeUnmount, onMounted, ref, useTemplateRef} from 'vue'
import IntroStage from '@/components/intro/IntroStage.vue'
import {INTRO_RANGE, INTRO_STEPS, INTRO_STILLS, STAGE_W} from '@/components/intro/introMotion.js'

const emit = defineEmits(['close'])

// 동작 줄이기 설정 사용자에게는 자동 재생 대신 단계별 정지 컷을 보여준다
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const dialog = useTemplateRef('dialog')
const stageBox = useTemplateRef('stageBox')
const stage = useTemplateRef('stage')
const barFills = []
const scale = ref(0.45)
const ended = ref(false)
const closing = ref(false)
const stillIdx = ref(0)

/* ---------- 재생 ------------------------------------------------------- */
// t는 매 프레임 바뀌므로 반응형으로 두지 않고 직접 그린다
let t = reduceMotion ? INTRO_STILLS[0] : INTRO_RANGE[0]
let playing = false
let lastNow = null
let rafId = 0

function draw() {
  stage.value?.render(t)
  INTRO_STEPS.forEach(([s0, s1], i) => {
    const p = Math.min(1, Math.max(0, (t - s0) / (s1 - s0)))
    if (barFills[i]) barFills[i].style.width = p * 100 + '%'
  })
}

function tick(now) {
  if (lastNow != null) t = Math.min(INTRO_RANGE[1], t + Math.min(0.1, (now - lastNow) / 1000))
  lastNow = now
  if (t >= INTRO_RANGE[1]) {
    playing = false
    ended.value = true
  }
  draw()
  rafId = playing ? requestAnimationFrame(tick) : 0
}

function play() {
  playing = true
  lastNow = null
  cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(tick)
}

function goStep(i) {
  if (reduceMotion) {
    stillIdx.value = i
    t = INTRO_STILLS[i]
    ended.value = i === INTRO_STEPS.length - 1
    draw()
    return
  }
  t = INTRO_STEPS[i][0]
  ended.value = false
  play()
}

// 지금 보고 있는 단계 (재생이 끝난 장면은 마지막 단계로 본다)
function currentStep() {
  if (reduceMotion) return stillIdx.value
  const i = INTRO_STEPS.findIndex(([, s1]) => t < s1)
  return i < 0 ? INTRO_STEPS.length - 1 : i
}

// 첫 단계에서 이전을 누르면 처음부터 다시 재생한다
function prevStep() {
  goStep(Math.max(0, currentStep() - 1))
}

// 마지막 단계에서 다음을 누르면 끝 장면으로 건너뛴다
function nextStep() {
  const i = currentStep()
  if (i < INTRO_STEPS.length - 1) {
    goStep(i + 1)
  } else if (!reduceMotion) {
    t = INTRO_RANGE[1]
    playing = false
    cancelAnimationFrame(rafId)
    ended.value = true
    draw()
  }
}

// 왼쪽 버튼: 재생 중엔 건너뛰기(동작 줄이기면 다음 단계), 끝나면 다시 보기
const subLabel = computed(() => {
  if (ended.value) return '다시 보기'
  return reduceMotion ? '다음' : '건너뛰기'
})

function onSubAction() {
  if (ended.value) goStep(0)
  else if (reduceMotion) goStep(stillIdx.value + 1)
  else close()
}

function close() {
  if (closing.value) return
  closing.value = true
  playing = false
  cancelAnimationFrame(rafId)
  setTimeout(() => emit('close'), reduceMotion ? 0 : 180) // 닫힘 애니메이션이 끝난 뒤
}

/* ---------- 키보드 ------------------------------------------------------ */
// 팝업이 떠 있는 동안 앱 전역 단축키(Delete 슬라이드 삭제, 방향키 이동 등)가 뒤에서 동작하지 않도록
// 캡처 단계에서 먼저 받아 전파를 막는다. Tab·Enter 같은 브라우저 기본 동작은 그대로 유지된다
// 좌우 방향키는 좌우 탭 영역과 같게 섹션을 이동한다
function onKeydown(e) {
  e.stopPropagation()
  if (e.key === 'Escape') {
    e.preventDefault()
    close()
  } else if (e.key === 'Tab') {
    trapFocus(e)
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    prevStep()
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    if (!ended.value) nextStep()
  }
}

function trapFocus(e) {
  const items = [...dialog.value.querySelectorAll('button')]
  const first = items[0], last = items[items.length - 1]
  if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog.value)) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

/* ---------- 마운트 ------------------------------------------------------ */
let prevFocus = null
let prevOverflow = ''
let ro

function fitStage() {
  scale.value = stageBox.value.clientWidth / STAGE_W
}

onMounted(() => {
  prevFocus = document.activeElement
  prevOverflow = document.documentElement.style.overflow
  document.documentElement.style.overflow = 'hidden'
  window.addEventListener('keydown', onKeydown, true)

  fitStage()
  ro = new ResizeObserver(fitStage)
  ro.observe(stageBox.value)

  dialog.value.focus({preventScroll: true})
  draw()
  if (!reduceMotion) play()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  ro?.disconnect()
  window.removeEventListener('keydown', onKeydown, true)
  document.documentElement.style.overflow = prevOverflow
  prevFocus?.focus?.({preventScroll: true})
})
</script>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(10, 14, 12, .55);
  -webkit-backdrop-filter: blur(3px);
  backdrop-filter: blur(3px);
  animation: backdrop-in .2s ease-out;
}

.dialog {
  position: relative;
  /* 화면 높이에 맞춰 4:5 스테이지 + 하단 바(72px)가 들어가도록 */
  width: min(520px, calc(100vw - 32px), calc((100vh - 120px) * .8));
  width: min(520px, calc(100vw - 32px), calc((100dvh - 120px) * .8));
  overflow: hidden;
  border-radius: 24px;
  background: #0B1511;
  color: #fff;
  box-shadow: 0 40px 120px rgba(0, 0, 0, .45);
  animation: dialog-in .28s cubic-bezier(.2, .9, .3, 1.15);
}

.dialog:focus {
  outline: none;
}

.closing {
  animation: backdrop-out .18s ease-in forwards;
}

.closing .dialog {
  animation: dialog-out .18s ease-in forwards;
}

.stage-box {
  position: relative;
  aspect-ratio: 4 / 5;
  overflow: hidden;
}

.bars {
  position: absolute;
  top: 12px;
  left: 14px;
  right: 56px;
  z-index: 3;
  display: flex;
  gap: 6px;
}

.bars button {
  flex: 1;
  padding: 6px 0;
  cursor: pointer;
}

.bars i {
  display: block;
  height: 4px;
  overflow: hidden;
  border-radius: 2px;
  background: rgba(255, 255, 255, .22);
}

.bars b {
  display: block;
  width: 0;
  height: 100%;
  border-radius: 2px;
  background: #fff;
}

.tap {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  padding: 0 10px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.tap:disabled {
  cursor: default;
}

.tap:focus-visible {
  outline: none;
}

.tap-prev {
  left: 0;
  width: 33%;
  justify-content: flex-start;
}

.tap-next {
  right: 0;
  width: 67%;
  justify-content: flex-end;
}

.tap-hint {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 0, 0, .45);
  color: #fff;
  opacity: 0;
  transform: scale(.85);
  transition: opacity .15s ease, transform .15s ease;
}

.tap-hint svg {
  width: 20px;
  height: 20px;
}

/* 호버 힌트는 마우스 환경에서만 (터치 기기에서는 누른 뒤 힌트가 남지 않게) */
@media (hover: hover) {
  .tap:not(:disabled):hover .tap-hint {
    opacity: 1;
    transform: none;
  }

  .tap:not(:disabled):active .tap-hint {
    transform: scale(.9);
  }
}

.tap:focus-visible .tap-hint {
  opacity: 1;
  transform: none;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, .7);
}

.close-btn {
  position: absolute;
  top: 4px;
  right: 8px;
  z-index: 3;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: rgba(255, 255, 255, .85);
  cursor: pointer;
}

.close-btn:hover {
  background: rgba(255, 255, 255, .1);
}

.close-btn svg {
  width: 20px;
  height: 20px;
}

.foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  padding: 0 14px 0 20px;
  border-top: 1px solid rgba(255, 255, 255, .07);
}

.sub-btn {
  padding: 8px 4px;
  font-size: 14px;
  font-weight: 700;
  color: #9FB0A7;
  cursor: pointer;
}

.sub-btn:hover {
  color: #fff;
}

.start-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 20px;
  border-radius: 12px;
  background: var(--color-primary, #00AB6B);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}

.start-btn:hover {
  background: #009960;
}

.start-btn svg {
  width: 18px;
  height: 18px;
}

.start-btn.pulse {
  animation: pulse 1.6s ease-out infinite;
}

@keyframes backdrop-in {
  from { opacity: 0; }
}

@keyframes backdrop-out {
  to { opacity: 0; }
}

@keyframes dialog-in {
  from { opacity: 0; transform: translateY(12px) scale(.96); }
}

@keyframes dialog-out {
  to { opacity: 0; transform: translateY(8px) scale(.97); }
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(0, 171, 107, .6); }
  100% { box-shadow: 0 0 0 16px rgba(0, 171, 107, 0); }
}

@media (prefers-reduced-motion: reduce) {
  .backdrop,
  .dialog,
  .closing,
  .closing .dialog,
  .start-btn.pulse {
    animation: none;
  }

  .tap-hint {
    transition: none;
  }
}
</style>
