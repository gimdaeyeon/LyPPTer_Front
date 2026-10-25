<!-- src/components/intro/IntroModal.vue -->
<!-- 첫 방문 인트로 팝업: 사용법 4단계를 모션으로 보여준다 (App.vue에서 열릴 때만 지연 로드) -->
<template>
  <div class="backdrop" :class="{closing}" @click.self="close('backdrop')">
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
      <button class="close-btn" aria-label="닫기" @click="close('x')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>

      <div ref="stageBox" class="stage-box"
           @pointerdown="onSwipeStart" @pointermove="onSwipeMove" @pointerup="onSwipeEnd"
           @pointercancel="onSwipeCancel" @click.capture="onStageClick">
        <!-- 캐러셀: 끄는 동안 지금 장면이 손가락을 따라가고, 옆 단계 장면(peek)이 함께 밀려 들어온다 -->
        <div class="pane" :class="{settling}" :style="mainPaneStyle">
          <IntroStage ref="stage" :style="stageStyle"/>
        </div>
        <div class="pane" :class="{settling}" :style="peekPaneStyle">
          <IntroStage ref="peek" :style="stageStyle"/>
        </div>
        <!-- 스토리처럼 좌우를 눌러 섹션 이동 (왼쪽 1/3은 이전, 나머지는 다음). 터치 기기에서는 옆으로 쓸어도 된다 -->
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
        <button class="start-btn" :class="{pulse: ended}" @click="close('start')">
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
import {track} from '@/utils/analytics.js'

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
  if (settling.value) return
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
  else close('skip')
}

// via: 'start' 시작하기 | 'skip' 건너뛰기 | 'x' 닫기 버튼 | 'esc' | 'backdrop' 바깥 클릭 (통계용)
function close(via) {
  if (closing.value) return
  closing.value = true
  // 어디까지 보고 닫았는지 (끝까지 봤으면 'end')
  track('intro-close', {via, step: ended.value ? 'end' : String(currentStep() + 1)})
  playing = false
  cancelAnimationFrame(rafId)
  setTimeout(() => emit('close'), reduceMotion ? 0 : 180) // 닫힘 애니메이션이 끝난 뒤
}

/* ---------- 스와이프 (터치) --------------------------------------------- */
// 캐러셀처럼 넘긴다. 끄는 동안 지금 장면이 손가락을 그대로 따라가고 옆 단계 장면이 함께 밀려 들어온다.
// 충분히 끌었거나 빠르게 튕기면 넘어가고, 아니면 제자리로 돌아온다. 마우스는 기존처럼 클릭으로만 넘긴다
const PANE_GAP = 12        // 두 장면 사이 간격(px)
const LAND_OFFSET = 0.5    // 넘어간 단계는 시작 0.5초 지점(자막이 거의 다 들어온 장면)부터 이어서 재생한다
const COMMIT_RATIO = 0.25  // 화면 폭의 이만큼 끌면 넘어간다
const FLICK_SPEED = 0.4    // px/ms, 이보다 빠르게 튕기면 짧게 끌어도 넘어간다
const SETTLE_MS = 300      // 손을 뗀 뒤 자리 잡는 시간 (CSS .pane.settling과 같게)

const peek = useTemplateRef('peek')
const offset = ref(0)       // 지금 장면의 가로 위치(px)
const peekDir = ref(0)      // 옆 장면 위치: 1 오른쪽(다음), -1 왼쪽(이전), 0 숨김
const settling = ref(false)
let swipe = null
let suppressClick = false

const stageStyle = computed(() => ({transform: `scale(${scale.value})`}))
const paneW = () => stageBox.value.clientWidth + PANE_GAP
const mainPaneStyle = computed(() => (offset.value ? {transform: `translate3d(${offset.value}px,0,0)`} : null))
const peekPaneStyle = computed(() => (peekDir.value
  ? {transform: `translate3d(${offset.value + peekDir.value * paneW()}px,0,0)`}
  : {visibility: 'hidden'}))

// dir 1은 다음, -1은 이전 단계. 더 갈 곳이 없으면 null
function neighbor(dir) {
  const i = currentStep()
  if (dir > 0) {
    if (ended.value) return null
    return i < INTRO_STEPS.length - 1 ? {t: INTRO_STEPS[i + 1][0] + LAND_OFFSET} : {t: INTRO_RANGE[1], end: true}
  }
  return i > 0 ? {t: INTRO_STEPS[i - 1][0] + LAND_OFFSET} : null
}

function pause() {
  playing = false
  cancelAnimationFrame(rafId)
}

function onSwipeStart(e) {
  if (e.pointerType === 'mouse' || !e.isPrimary || settling.value) return
  swipe = {id: e.pointerId, x: e.clientX, y: e.clientY, axis: null, dir: 0, target: null, resume: false, samples: []}
}

function onSwipeMove(e) {
  if (!swipe || e.pointerId !== swipe.id) return
  const dx = e.clientX - swipe.x
  if (!swipe.axis) {
    const dy = e.clientY - swipe.y
    if (Math.hypot(dx, dy) < 8) return
    swipe.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
    // 가로로 끄는 동안은 재생을 멈춰 손가락 아래 장면이 바뀌지 않게 한다
    if (swipe.axis === 'x') {
      swipe.resume = playing
      pause()
    }
  }
  if (swipe.axis !== 'x') return
  swipe.samples.push([e.timeStamp, e.clientX])
  if (swipe.samples.length > 5) swipe.samples.shift()
  if (reduceMotion) return

  const dir = dx < 0 ? 1 : -1
  if (dir !== swipe.dir) {
    swipe.dir = dir
    swipe.target = neighbor(dir)
    if (swipe.target) peek.value.render(swipe.target.t)
    peekDir.value = swipe.target ? dir : 0
  }
  // 더 갈 곳이 없는 쪽으로는 고무줄처럼 덜 따라온다
  offset.value = swipe.target ? dx : dx * 0.25
}

function onSwipeEnd(e) {
  if (!swipe || e.pointerId !== swipe.id) return
  const s = swipe
  swipe = null
  if (s.axis !== 'x') return // 그냥 탭은 탭 버튼의 click이, 세로 쓸기는 아무것도 처리하지 않는다

  // 끈 뒤 손을 뗄 때 따라오는 click으로 한 번 더 넘어가지 않게
  suppressClick = true
  setTimeout(() => (suppressClick = false), 400)

  const dx = e.clientX - s.x
  const [t0, x0] = s.samples[0] ?? [e.timeStamp, s.x]
  const v = (e.clientX - x0) / Math.max(1, e.timeStamp - t0)
  const dir = dx < 0 ? 1 : -1
  const commit = Math.abs(dx) > stageBox.value.clientWidth * COMMIT_RATIO
    || (Math.abs(v) > FLICK_SPEED && Math.sign(v) === Math.sign(dx))

  if (reduceMotion) {
    if (!commit) {
      if (s.resume) play()
    } else if (dir > 0) {
      if (!ended.value) nextStep()
    } else {
      prevStep()
    }
    return
  }

  const target = commit && s.dir === dir ? s.target : null
  settle(target ? -dir * paneW() : 0, () => {
    if (target) land(target)
    else if (s.resume) play()
  })
}

function onSwipeCancel() {
  const s = swipe
  swipe = null
  if (s?.axis === 'x') settle(0, () => s.resume && play())
}

// 손을 뗀 위치에서 목표 위치까지 미끄러지듯 이동한 뒤 done 실행
function settle(to, done) {
  settling.value = true
  offset.value = to
  setTimeout(() => {
    settling.value = false
    peekDir.value = 0
    done()
  }, SETTLE_MS + 20)
}

// 옆 장면이 화면을 다 덮은 순간, 지금 장면을 같은 시점으로 바꿔 제자리에 돌려놓는다 (눈에는 이어진 화면)
function land(target) {
  t = target.t
  ended.value = !!target.end
  draw()
  offset.value = 0
  if (!target.end) play()
}

function onStageClick(e) {
  if (!suppressClick) return
  suppressClick = false
  e.stopPropagation()
  e.preventDefault()
}

/* ---------- 키보드 ------------------------------------------------------ */
// 팝업이 떠 있는 동안 앱 전역 단축키(Delete 슬라이드 삭제, 방향키 이동 등)가 뒤에서 동작하지 않도록
// 캡처 단계에서 먼저 받아 전파를 막는다. Tab·Enter 같은 브라우저 기본 동작은 그대로 유지된다
// 좌우 방향키는 좌우 탭 영역과 같게 섹션을 이동한다
function onKeydown(e) {
  e.stopPropagation()
  if (e.key === 'Escape') {
    e.preventDefault()
    close('esc')
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
  /* 가로 쓸기는 직접 처리하고, 브라우저의 가로 제스처(뒤로 가기 등)는 막는다 */
  touch-action: pan-y;
  user-select: none;
  -webkit-user-select: none;
}

.pane {
  position: absolute;
  inset: 0;
  overflow: hidden;
  will-change: transform;
}

.pane.settling {
  transition: transform .3s cubic-bezier(.22, .8, .24, 1);
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

  .tap-hint,
  .pane.settling {
    transition: none;
  }
}
</style>
