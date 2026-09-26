<!-- src/components/intro/IntroStage.vue -->
<!-- 인트로 팝업의 애니메이션 장면. 1080×1350 고정 좌표로 그리고 부모가 scale로 맞춘다 (움직임은 introMotion.js) -->
<template>
  <div ref="root" class="stage" aria-hidden="true">
    <div class="bgl">
      <div class="glow g1" data-el="g1"/>
      <div class="glow g2" data-el="g2"/>
      <div class="dotgrid"/>
      <div class="vignette"/>
    </div>

    <!-- 앱 목업: 카메라(줌) → 등장 애니메이션 → 목업 + 오버레이 -->
    <div class="cam" data-el="cam">
      <div class="cam-in" data-el="camIn">
        <div class="mock" data-el="mock">
          <div class="m-chrome"><i/><i/><i/><span class="m-tabt">Lyppter - 가사를 PPT로 변환</span></div>
          <div class="m-header">
            <div class="m-brand"><img src="/lyppter.png" alt=""><span>Lyppter</span></div>
            <div class="m-actions">
              <span class="m-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>
              </span>
              <span class="m-export" data-el="export">Export</span>
            </div>
          </div>

          <div class="m-body">
            <div class="m-preview" data-el="preview">
              <div class="slide" data-el="mainSlide">
                <div class="s-img"/>
                <div class="s-box">
                  <p class="s-text"/>
                  <div class="selbox" data-el="selbox">
                    <i v-for="([x, y], i) in HANDLES" :key="i" :style="{left: x + '%', top: y + '%'}"/>
                  </div>
                </div>
                <div class="guide-v" data-el="guideV"/>
                <div class="guide-h" data-el="guideH"/>
              </div>
            </div>

            <div class="m-strip">
              <div class="thumb" data-el="phThumb">
                <div class="slide thumb-slide"><div class="s-img"/><div class="s-box"><p class="s-text"/></div></div>
                <span class="num">1</span>
              </div>
              <div v-for="(_, i) in LYRICS" :key="i" class="thumb" data-el="thumb" :style="{left: i * 212 + 'px'}">
                <div class="slide thumb-slide"><div class="s-img"/><div class="s-box"><p class="s-text"/></div></div>
                <span class="num">{{ i + 1 }}</span>
              </div>
            </div>

            <div class="m-tabs">
              <div class="m-tab on" data-el="tabLyr">
                Lyrics
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3z"/><path d="M13.5 6.5l3 3"/></svg>
              </div>
              <div class="m-tab" data-el="tabSet">
                Settings
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="6.6"/><path d="M12 2.6v2.8M12 18.6v2.8M2.6 12h2.8M18.6 12h2.8M5.4 5.4l2 2M16.6 16.6l2 2M5.4 18.6l2-2M16.6 7.4l2-2"/></svg>
              </div>
              <i class="m-line" data-el="tabLine"/>
            </div>

            <div class="m-panel">
              <div class="m-ta" data-el="ta">
                <div class="flash" data-el="flash"/>
                <div class="ph" data-el="ph"><span class="caret" data-el="caret0"/>Type or paste lyrics here...</div>
                <div class="lyr" data-el="lyr">{{ LYRICS_TEXT }}<span class="caret" data-el="caret1"/></div>
                <div v-for="line in BLANK_LINES" :key="line" class="btag" data-el="btag" :style="{top: 18 + line * 28 + 'px'}">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5v6a3 3 0 0 1-3 3H6"/><path d="M10 10l-4 4 4 4"/></svg>
                  <span>새 슬라이드</span>
                </div>
              </div>

              <div class="m-set" data-el="set">
                <div class="f-lab">Font Family</div>
                <div class="m-select" data-el="sel">
                  <span data-el="selVal">Arial</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 9l-7 7-7-7"/></svg>
                </div>
                <div class="f-bg">
                  <div class="f-head">
                    <div class="f-lab">Background</div>
                    <div class="m-ibs">
                      <span class="m-ib on" data-el="ibPal">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.6-.8 1.6-1.6 0-.9-.8-1.3-.8-2.2 0-.9.7-1.6 1.6-1.6H16a5 5 0 0 0 5-5C21 6.4 17 3 12 3z"/><circle cx="7.5" cy="11" r="1.2" fill="currentColor"/><circle cx="10.5" cy="7" r="1.2" fill="currentColor"/><circle cx="15" cy="7.6" r="1.2" fill="currentColor"/></svg>
                      </span>
                      <span class="m-ib" data-el="ibImg">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="M21 16l-5-5-9 9"/></svg>
                      </span>
                    </div>
                  </div>
                  <div class="f-line">
                    <div class="f-color" data-el="fColor"><span class="sw"><i/></span><span class="m-input">#000000</span></div>
                    <div class="f-file" data-el="fFile">
                      <span class="m-input">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V4M7 9l5-5 5 5M4 20h16"/></svg>
                        stage-lights.jpg
                      </span>
                      <span class="m-x">×</span>
                    </div>
                  </div>
                </div>
                <div class="m-list" data-el="list">
                  <div class="m-search">
                    <div>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/></svg>
                      폰트 검색...
                    </div>
                  </div>
                  <div class="m-grp">한국어</div>
                  <div class="m-opt" style="font-family: 'Noto Serif KR', serif">Noto Serif KR</div>
                  <div class="m-opt" style="font-family: 'Nanum Gothic', sans-serif">Nanum Gothic</div>
                  <div class="m-opt serif" data-el="optNM">Nanum Myeongjo</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 오버레이 (목업 좌표계): 키캡 · 파일 카드 · 날아가는 썸네일 · 커서 -->
        <div class="ov">
          <div class="dim" data-el="dim"/>
          <div class="okeys" data-el="keys">
            <span class="key k-ctrl" data-el="keyCtrl">Ctrl</span><span class="plus">+</span><span class="key" data-el="keyV">V</span>
          </div>
          <div class="fcard" data-el="fcard">
            <div class="ficon" data-el="ficon">
              <svg viewBox="0 0 128 156"><path d="M18 0h68l42 42v96a18 18 0 0 1-18 18H18A18 18 0 0 1 0 138V18A18 18 0 0 1 18 0z" fill="#EA580C"/><path d="M86 0v28a14 14 0 0 0 14 14h28z" fill="#FDBA8C"/><rect x="20" y="58" width="88" height="50" rx="7" fill="#fff" fill-opacity=".26"/><rect x="34" y="75" width="60" height="6" rx="3" fill="#fff" fill-opacity=".92"/><rect x="44" y="87" width="40" height="6" rx="3" fill="#fff" fill-opacity=".92"/><text x="64" y="140" text-anchor="middle" font-family="Plus Jakarta Sans, Arial, sans-serif" font-weight="700" font-size="23" fill="#fff" letter-spacing="1">PPTX</text></svg>
            </div>
            <div class="finfo">
              <div class="fname">주일 찬양.pptx</div>
              <div class="fmeta">슬라이드 4장 · 16:9 와이드</div>
              <div class="fbar"><i data-el="fbar"/></div>
              <div class="fstat">
                <span data-el="fs0">PPT 만드는 중…</span>
                <span class="done" data-el="fs1">
                  <span class="fcheck" data-el="fcheck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>
                  다운로드 완료
                </span>
              </div>
            </div>
          </div>
          <div v-for="(_, i) in LYRICS" :key="i" class="fly" data-el="fly">
            <div class="slide thumb-slide"><div class="s-img"/><div class="s-box"><p class="s-text"/></div></div>
          </div>
          <div class="ring" data-el="ring"/>
          <div class="cursor" data-el="cursor">
            <svg class="c-arrow" data-el="cArrow" viewBox="0 0 24 24"><path d="M4 2.5v16.8l4.4-4.1 2.9 6.6 2.9-1.3-2.8-6.4h6.2z" fill="#111" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg>
            <svg class="c-move" data-el="cMove" viewBox="0 0 24 24"><path d="M12 1.8l3.4 3.4h-2.3v5.7h5.7V8.6l3.4 3.4-3.4 3.4v-2.3h-5.7v5.7h2.3L12 22.2l-3.4-3.4h2.3v-5.7H5.2v2.3L1.8 12l3.4-3.4v2.3h5.7V5.2H8.6z" fill="#111" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/></svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 단계별 자막 -->
    <div class="cap" data-el="cap">
      <div class="kicker"><b>STEP 1</b><i/>붙여넣기</div>
      <div class="title"><span class="ln"><span>가사를 붙여넣으면</span></span><span class="ln"><span><em class="hl">빈 줄마다</em> 슬라이드로</span></span></div>
    </div>
    <div class="cap" data-el="cap">
      <div class="kicker"><b>STEP 2</b><i/>꾸미기</div>
      <div class="title"><span class="ln"><span>글꼴·배경을 바꾸면</span></span><span class="ln"><span>모든 장에 <em class="hl">한 번에</em></span></span></div>
    </div>
    <div class="cap" data-el="cap">
      <div class="kicker"><b>STEP 3</b><i/>배치하기</div>
      <div class="title"><span class="ln"><span>위치는 <em class="hl">드래그</em>로,</span></span><span class="ln"><span>정렬은 <em class="hl">스냅</em>으로</span></span></div>
    </div>
    <div class="cap" data-el="cap">
      <div class="kicker"><b>STEP 4</b><i/>내보내기</div>
      <div class="title"><span class="ln"><span>Export 한 번이면</span></span><span class="ln"><span><em class="hl">PPT 파일</em> 완성</span></span></div>
    </div>
  </div>
</template>

<script setup>
import {onBeforeUnmount, onMounted, useTemplateRef} from 'vue'
import {createIntroMotion, INTRO_RANGE, LYRICS} from '@/components/intro/introMotion.js'
import {loadFontByName} from '@/composables/useFontLoader.js'
import {fontFamilies} from '@/utils/fontFamily.js'

const HANDLES = [[0, 0], [50, 0], [100, 0], [0, 50], [100, 50], [0, 100], [50, 100], [100, 100]]
const LYRICS_TEXT = LYRICS.join('\n\n')
const BLANK_LINES = [2, 5, 8] // LYRICS_TEXT에서 빈 줄의 줄 번호 (0부터)

const root = useTemplateRef('root')
let motion = null
let lastT = INTRO_RANGE[0]

function render(t) {
  lastT = t
  motion?.render(t)
}

// 폰트가 늦게 로드되면 글자 폭이 바뀌므로 커서가 향할 좌표를 다시 잰다
function remeasure() {
  if (!motion) return
  motion.measure()
  motion.render(lastT)
}

onMounted(() => {
  motion = createIntroMotion(root.value)
  motion.render(lastT)
  document.fonts.ready.then(remeasure)
  loadFontByName('Nanum Myeongjo', fontFamilies).then(remeasure) // STEP 2에서 바뀌는 글꼴
})

onBeforeUnmount(() => {
  motion = null
})

defineExpose({render})
</script>

<style scoped>
/* 크기·좌표는 모두 1080×1350 스테이지 기준 px */
.stage {
  --green: var(--color-primary, #00AB6B);
  --green-hi: #2BD192;
  --green-deep: #009960;
  --green-tint: #E5F6F0;
  --gold: var(--color-secondary, #B88746);
  --ink: #1C160C;
  --g50: #F9FAFB;
  --g100: #F3F4F6;
  --g200: #E5E7EB;
  --g300: #D1D5DB;
  --g400: #9CA3AF;
  --g500: #6B7280;
  --g700: #374151;
  --g900: #111827;
  --sans: 'Noto Sans KR', 'Plus Jakarta Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;
  --latin: 'Plus Jakarta Sans', 'Noto Sans KR', 'Malgun Gothic', sans-serif;
  --serif-kr: 'Nanum Myeongjo', 'Batang', 'AppleMyungjo', serif;
  position: absolute;
  left: 0;
  top: 0;
  width: 1080px;
  height: 1350px;
  transform-origin: 0 0;
  overflow: hidden;
  contain: layout paint;
  background: #06100C;
  color: #fff;
  font-family: var(--sans);
  -webkit-font-smoothing: antialiased;
  user-select: none;
}

/* ---------- 배경 ---------- */
.bgl { position: absolute; inset: 0; overflow: hidden; }
.glow { position: absolute; left: 0; top: 0; border-radius: 50%; }
.g1 { width: 1500px; height: 1500px; background: radial-gradient(closest-side, rgba(0, 171, 107, .36), rgba(0, 171, 107, .09) 55%, rgba(0, 171, 107, 0)); }
.g2 { width: 1200px; height: 1200px; background: radial-gradient(closest-side, rgba(184, 135, 70, .24), rgba(184, 135, 70, 0)); }
.dotgrid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, .075) 1.5px, transparent 1.7px);
  background-size: 40px 40px;
  -webkit-mask-image: radial-gradient(ellipse 72% 58% at 50% 42%, #000 18%, transparent 78%);
  mask-image: radial-gradient(ellipse 72% 58% at 50% 42%, #000 18%, transparent 78%);
}
.vignette { position: absolute; inset: 0; background: radial-gradient(ellipse 95% 75% at 50% 45%, transparent 55%, rgba(0, 0, 0, .55)); }

/* ---------- 자막 ---------- */
.cap { position: absolute; left: 0; right: 0; top: 84px; z-index: 3; padding: 0 50px; text-align: center; }
.kicker {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 11px 26px 11px 20px;
  border: 1.5px solid rgba(43, 209, 146, .34);
  border-radius: 999px;
  background: rgba(0, 171, 107, .14);
  color: #C4F1DD;
  font-size: 26px;
  font-weight: 700;
  line-height: 1.2;
}
.kicker b { font-family: var(--latin); font-size: .84em; font-weight: 700; letter-spacing: .07em; color: var(--green-hi); }
.kicker i { width: 2px; height: .9em; background: rgba(196, 241, 221, .35); }
.title { margin-top: 22px; font-size: 64px; font-weight: 700; line-height: 1.2; letter-spacing: -.04em; }
.ln { display: block; overflow: hidden; margin-bottom: -.1em; padding: 0 .08em .1em; }
.ln > span { display: inline-block; }
em.hl {
  font-style: normal;
  color: var(--green-hi);
  background: linear-gradient(transparent 70%, rgba(0, 171, 107, .4) 70%, rgba(0, 171, 107, .4) 90%, transparent 90%) no-repeat 0 0 / 0% 100%;
}

/* ---------- 카메라 · 앱 목업 (940×1283) ---------- */
.cam { position: absolute; left: 0; top: 0; z-index: 2; width: 940px; height: 1283px; transform-origin: 0 0; perspective: 2600px; perspective-origin: 50% 25%; }
.cam-in { position: absolute; inset: 0; transform-origin: 50% 40%; }
.mock {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: 36px;
  background: #fff;
  color: var(--g900);
  box-shadow: 0 50px 120px rgba(0, 0, 0, .6), 0 0 0 1px rgba(255, 255, 255, .1);
}
.m-chrome { position: relative; display: flex; align-items: center; gap: 10px; height: 44px; padding: 0 20px; border-bottom: 1px solid var(--g200); background: #F1F3F2; }
.m-chrome i { width: 14px; height: 14px; border-radius: 50%; background: #FF5F57; }
.m-chrome i:nth-child(2) { background: #FEBC2E; }
.m-chrome i:nth-child(3) { background: #28C840; }
.m-tabt { position: absolute; left: 50%; transform: translateX(-50%); white-space: nowrap; font-size: 17px; color: var(--g500); }
.m-header { display: flex; align-items: center; justify-content: space-between; height: 100px; padding: 0 34px; border-bottom: 1.5px solid var(--g200); }
.m-brand { display: flex; align-items: center; gap: 12px; font: 700 34px/1 var(--latin); letter-spacing: -.02em; color: var(--g900); }
.m-brand img { width: 50px; height: 50px; }
.m-actions { display: flex; align-items: center; gap: 14px; }
.m-icon { display: grid; place-items: center; width: 56px; height: 56px; border-radius: 14px; color: var(--g500); }
.m-icon svg { width: 30px; height: 30px; }
.m-export { display: block; height: 62px; padding: 0 30px; border-radius: 12px; background: var(--green); color: #fff; font: 700 26px/62px var(--latin); letter-spacing: .01em; }
.m-export.hover { background: var(--green-deep); }
.m-body { padding: 28px 32px; }
.m-preview { position: relative; width: 876px; height: 493px; overflow: hidden; border-radius: 14px; box-shadow: 0 0 0 1.5px var(--g200); }
.m-strip { position: relative; height: 118px; margin-top: 20px; }
.thumb { position: absolute; left: 0; top: 4px; width: 196px; height: 110.3px; overflow: hidden; border-radius: 10px; box-shadow: 0 0 0 2px var(--g300); }
.thumb.on { box-shadow: 0 0 0 4px var(--green); }
.thumb .num { position: absolute; left: 10px; bottom: 6px; font: 700 15px/1 var(--latin); color: #fff; text-shadow: 0 1px 3px rgba(0, 0, 0, .85); }
.m-tabs { position: relative; display: flex; gap: 40px; height: 64px; margin-top: 18px; padding: 0 20px; border-bottom: 1.5px solid var(--g200); }
.m-tab { display: flex; align-items: center; gap: 10px; padding: 0 8px; font: 700 24px/1 var(--latin); color: var(--gold); }
.m-tab.on { color: var(--ink); }
.m-tab svg { width: 24px; height: 24px; }
.m-line { position: absolute; left: 0; bottom: -1.5px; height: 4px; border-radius: 2px; background: var(--green); }
.m-panel { position: relative; height: 354px; margin-top: 16px; }

/* 가사 입력창 */
.m-ta { position: absolute; inset: 0; overflow: hidden; padding: 18px 22px; border: 1.5px solid var(--g200); border-radius: 18px; font: 400 20px/28px var(--sans); color: var(--g900); }
.m-ta.focus { border-color: var(--green); box-shadow: 0 0 0 4px rgba(0, 171, 107, .14); }
.flash { position: absolute; inset: 0; background: var(--green-tint); }
.ph { position: absolute; left: 22px; top: 18px; color: var(--gold); }
.lyr { position: absolute; left: 22px; top: 18px; right: 22px; white-space: pre-wrap; }
.caret { display: inline-block; width: 2px; height: 24px; margin: 0 1px; background: var(--g900); vertical-align: -5px; }
.btag {
  position: absolute;
  right: 18px;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 13px 0 10px;
  border-radius: 999px;
  background: var(--green);
  color: #fff;
  font: 700 15px/1 var(--sans);
  box-shadow: 0 4px 10px rgba(0, 171, 107, .3);
}
.btag svg { width: 16px; height: 16px; }

/* 설정 패널 */
.m-set { position: absolute; inset: 0; padding: 6px 4px; }
.f-lab { font: 400 19px/1 var(--latin); color: var(--g700); }
.m-select { display: flex; align-items: center; justify-content: space-between; height: 60px; margin-top: 12px; padding: 0 18px; border: 1.5px solid var(--g200); border-radius: 12px; font-size: 22px; color: var(--g900); }
.m-select.open { border-color: #60A5FA; box-shadow: 0 0 0 3px rgba(96, 165, 250, .22); }
.m-select svg { width: 22px; height: 22px; color: var(--g400); }
.serif { font-family: var(--serif-kr) !important; font-weight: 700; }
.f-bg { margin-top: 28px; }
.f-head { display: flex; align-items: center; justify-content: space-between; }
.m-ibs { display: flex; gap: 8px; }
.m-ib { display: grid; place-items: center; width: 56px; height: 56px; border: 1.5px solid var(--g200); border-radius: 12px; color: var(--g500); }
.m-ib svg { width: 26px; height: 26px; }
.m-ib.on { background: var(--green-tint); color: var(--green); }
.f-line { position: relative; height: 60px; margin-top: 12px; }
.f-color, .f-file { position: absolute; inset: 0; display: flex; gap: 12px; }
.sw { display: grid; flex: none; place-items: center; width: 60px; height: 60px; border: 1.5px solid var(--g200); border-radius: 12px; }
.sw i { width: 38px; height: 38px; border-radius: 50%; background: #000; }
.m-input { display: flex; flex: 1; align-items: center; gap: 10px; height: 60px; padding: 0 18px; border: 1.5px solid var(--g200); border-radius: 12px; font-size: 21px; color: var(--g900); }
.f-file .m-input { justify-content: center; font-weight: 700; }
.m-input svg { width: 22px; height: 22px; }
.m-x { display: grid; flex: none; place-items: center; width: 60px; height: 60px; font: 400 26px/1 var(--latin); color: var(--g500); }
.m-list {
  position: absolute;
  left: 4px;
  right: 4px;
  top: 104px;
  z-index: 5;
  overflow: hidden;
  border: 1.5px solid var(--g200);
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 18px 44px rgba(0, 0, 0, .18);
  transform-origin: 50% 0;
}
.m-search { padding: 10px 12px; border-bottom: 1px solid var(--g100); }
.m-search div { display: flex; align-items: center; gap: 8px; height: 38px; padding: 0 12px; border: 1.5px solid var(--g200); border-radius: 8px; font-size: 16px; color: var(--g400); }
.m-search svg { width: 16px; height: 16px; }
.m-grp { padding: 7px 16px; background: var(--g50); font: 700 13px/1.3 var(--sans); letter-spacing: .08em; color: var(--g400); }
.m-opt { display: flex; align-items: center; height: 48px; padding: 0 16px; font-size: 21px; color: var(--g900); }
.m-opt.hover { background: var(--g100); }

/* ---------- 슬라이드 (876×493 = 10in × 5.625in) ---------- */
.slide { position: absolute; left: 0; top: 0; width: 876px; height: 493px; overflow: hidden; background: #000; transform-origin: 0 0; }
.thumb-slide { transform: scale(.223744); } /* 196 / 876 */
/* 배경 이미지 대신 CSS로 그린 무대 조명 보케 */
.s-img {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle 46px at 16% 26%, rgba(255, 214, 150, .62) 0 45%, rgba(255, 214, 150, .2) 62%, rgba(255, 214, 150, 0) 100%),
    radial-gradient(circle 64px at 79% 19%, rgba(255, 196, 130, .5) 0 42%, rgba(255, 196, 130, .16) 60%, rgba(255, 196, 130, 0) 100%),
    radial-gradient(circle 34px at 64% 73%, rgba(255, 232, 190, .42) 0 45%, rgba(255, 232, 190, 0) 100%),
    radial-gradient(circle 58px at 29% 80%, rgba(170, 185, 255, .36) 0 42%, rgba(170, 185, 255, 0) 100%),
    radial-gradient(circle 70px at 91% 84%, rgba(255, 170, 110, .4) 0 40%, rgba(255, 170, 110, 0) 100%),
    radial-gradient(circle 90px at 46% 30%, rgba(255, 240, 210, .2) 0 35%, rgba(255, 240, 210, 0) 100%),
    radial-gradient(circle 52px at 6% 64%, rgba(255, 200, 140, .32) 0 40%, rgba(255, 200, 140, 0) 100%),
    radial-gradient(circle 28px at 55% 12%, rgba(255, 225, 180, .45) 0 45%, rgba(255, 225, 180, 0) 100%),
    linear-gradient(112deg, rgba(255, 255, 255, 0) 36%, rgba(255, 236, 200, .11) 50%, rgba(255, 255, 255, 0) 64%),
    radial-gradient(ellipse 90% 60% at 50% 118%, rgba(255, 150, 60, .55), rgba(255, 150, 60, 0) 70%),
    linear-gradient(165deg, #121A3E 0%, #2B1656 50%, #4D1F3C 100%);
}
.s-img::after { content: ""; position: absolute; inset: 0; background: rgba(0, 0, 0, .14); }
.s-box { position: absolute; left: 438px; top: 246.5px; width: 745px; }
.s-text { padding: 2px; color: #fff; font: 700 42px/1.3 var(--sans); text-align: center; white-space: pre-line; word-break: keep-all; }
.slide.serif .s-text { font-family: var(--serif-kr); letter-spacing: -.01em; }
.selbox { position: absolute; inset: -8px; border: 2px dashed #60A5FA; border-radius: 2px; }
.selbox i { position: absolute; width: 14px; height: 14px; border: 1.5px solid var(--g400); border-radius: 2px; background: #fff; transform: translate(-50%, -50%); }
.guide-v { position: absolute; top: 0; bottom: 0; left: 437px; border-left: 2px dashed rgba(59, 130, 246, .95); }
.guide-h { position: absolute; left: 0; right: 0; top: 0; border-top: 2px dashed rgba(59, 130, 246, .95); }

/* ---------- 오버레이 ---------- */
.ov { position: absolute; inset: 0; z-index: 10; pointer-events: none; }
.dim { position: absolute; inset: 0; border-radius: 36px; background: rgba(6, 16, 12, .45); }
.okeys { position: absolute; left: 0; top: 0; display: flex; align-items: center; gap: 10px; }
.key {
  display: grid;
  place-items: center;
  min-width: 78px;
  height: 78px;
  padding: 0 18px;
  border-radius: 16px;
  background: linear-gradient(#FBFCFB, #E6ECE9);
  color: var(--ink);
  font: 700 30px/1 var(--latin);
  box-shadow: 0 6px 0 #A9B5AF, 0 14px 24px rgba(0, 0, 0, .28);
}
.key.k-ctrl { min-width: 116px; font-size: 27px; }
.plus { font: 700 30px/1 var(--latin); color: var(--g400); }
.fcard {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  gap: 30px;
  width: 640px;
  height: 236px;
  margin: -118px 0 0 -320px;
  padding: 0 40px;
  border-radius: 28px;
  background: #fff;
  color: var(--g900);
  box-shadow: 0 40px 90px rgba(0, 0, 0, .4), 0 0 0 1px rgba(0, 0, 0, .05);
}
.ficon { flex: none; width: 128px; height: 156px; }
.finfo { flex: 1; min-width: 0; }
.fname { font: 700 32px/1.2 var(--sans); letter-spacing: -.02em; }
.fmeta { margin-top: 8px; font: 400 20px/1 var(--sans); color: var(--g500); }
.fbar { height: 12px; margin-top: 22px; overflow: hidden; border-radius: 6px; background: var(--g100); }
.fbar i { display: block; width: 0; height: 100%; border-radius: 6px; background: var(--green); }
.fstat { position: relative; height: 30px; margin-top: 14px; }
.fstat > span { position: absolute; left: 0; top: 0; display: flex; align-items: center; gap: 10px; height: 30px; white-space: nowrap; font: 700 20px/1 var(--sans); color: var(--g500); }
.fstat .done { color: var(--green-deep); }
.fcheck { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; background: var(--green); color: #fff; }
.fcheck svg { width: 18px; height: 18px; }
.fly { position: absolute; left: 0; top: 0; width: 196px; height: 110.3px; margin: -55.15px 0 0 -98px; overflow: hidden; border-radius: 10px; box-shadow: 0 12px 30px rgba(0, 0, 0, .4); }
.ring { position: absolute; left: 0; top: 0; width: 64px; height: 64px; margin: -32px 0 0 -32px; border: 3px solid var(--green); border-radius: 50%; }
.cursor { position: absolute; left: 0; top: 0; width: 46px; height: 46px; }
.cursor svg { position: absolute; inset: 0; width: 100%; height: 100%; filter: drop-shadow(0 4px 6px rgba(0, 0, 0, .35)); }
</style>
