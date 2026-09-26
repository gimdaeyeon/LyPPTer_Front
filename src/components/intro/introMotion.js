/**
 * 첫 방문 인트로 모션 엔진
 *
 * - render(t): 시간 t(초)의 장면을 그리는 순수 함수라 재생·단계 이동·정지 컷이 모두 같은 코드를 쓴다
 * - 타임라인은 SNS 홍보 영상과 같은 절대 시간을 쓰고, 팝업은 그중 STEP 1~4 구간만 재생한다
 * - 매 프레임 수십 개 요소를 갱신하므로 Vue 반응성 대신 DOM 스타일을 직접 바꾼다
 * - 좌표계: 스테이지 1080×1350px, 앱 목업 940×1283px, 슬라이드 876×493px(= 10in × 5.625in)
 */
import {SLIDE_W} from '@/utils/pptUnits.js'
import {SNAP_THRESHOLD_INCHES} from '@/utils/constants.js'

export const STAGE_W = 1080
export const STAGE_H = 1350
export const INTRO_RANGE = [2.9, 15.8]
export const INTRO_STEPS = [[2.9, 7.3], [7.3, 10.8], [10.8, 13.4], [13.4, 15.8]]
// prefers-reduced-motion 사용자에게 보여줄 단계별 정지 컷
export const INTRO_STILLS = [5.4, 10.3, 12.9, 15.7]

// 데모 가사 — 실제 곡 대신 기능을 설명하는 자체 문구 (저작권 문제 회피)
export const LYRICS = [
    '가사를 붙여넣으면\n슬라이드가 피어나고',
    '빈 줄 하나마다\n새 장이 열리네',
    '글꼴도 배경도\n마음 가는 대로',
    '버튼 한 번 누르면\n예배 준비 끝',
]
export const PLACEHOLDER = '가사를 입력하세요'

/* ---------- 이징 · 트윈 헬퍼 -------------------------------------------- */
const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v)
const lerp = (a, b, p) => a + (b - a) * p
const E = {
    lin: p => p,
    inC: p => p * p * p,
    outC: p => 1 - (1 - p) ** 3,
    ioC: p => (p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2),
    outQ: p => 1 - (1 - p) ** 5,
    outBack: p => {
        const c1 = 1.70158, c3 = c1 + 1
        return 1 + c3 * (p - 1) ** 3 + c1 * (p - 1) ** 2
    },
}
// t0부터 d초 동안 0 → 1
const P = (t, t0, d, e = E.outC) => e(clamp((t - t0) / d))
const smooth = p => p * p * (3 - 2 * p)

// [[time, {key: value}, easing?], ...] 키프레임 보간
function track(t, kf) {
    if (t <= kf[0][0]) return kf[0][1]
    for (let i = 1; i < kf.length; i++) {
        if (t <= kf[i][0]) {
            const [t0, a] = kf[i - 1]
            const [t1, b, e] = kf[i]
            const p = (E[e] || E.ioC)(clamp((t - t0) / (t1 - t0 || 1)))
            const o = {}
            for (const k in a) o[k] = lerp(a[k], b[k], p)
            return o
        }
    }
    return kf[kf.length - 1][1]
}

const tf = (el, x = 0, y = 0, s = 1, r = 0) => {
    el.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) scale(${s.toFixed(4)}) rotate(${r.toFixed(2)}deg)`
}
const op = (el, o) => {
    el.style.opacity = o.toFixed(3)
    el.style.visibility = o <= 0.002 ? 'hidden' : 'visible'
}
// 줄 단위 마스크 리빌
const reveal = (inner, p) => {
    inner.style.transform = `translate3d(0,${((1 - p) * 112).toFixed(2)}%,0)`
}
// 형광펜 밑줄 스윕
const sweep = (em, p) => {
    em.style.backgroundSize = `${(p * 100).toFixed(1)}% 100%`
}
const pressKey = (el, d, depth = 6) => {
    el.style.transform = `translate3d(0,${(depth * 0.75 * d).toFixed(2)}px,0)`
    el.style.boxShadow = `0 ${(depth * (1 - 0.75 * d)).toFixed(2)}px 0 #A9B5AF,0 ${(depth * 2.2 - depth * d).toFixed(1)}px ${depth * 3.6}px rgba(0,0,0,.4)`
}

/* ---------- 레이아웃 · 타이밍 ------------------------------------------- */
const MOCK_TOP = 346, MOCK_SCALE = 0.76, MOCK_CX = 470, MOCK_CY = 641.5
const SW = 876, SH = 493, CX = SW / 2
const SNAP = SNAP_THRESHOLD_INCHES / SLIDE_W * SW // 앱과 같은 0.3in 스냅 임계값
const SNAP_YS = [SH / 3, SH / 2, SH * 2 / 3]      // useSnapGuides와 같은 1/3 · 1/2 · 2/3 라인
const BOX_Y0 = 166, DRAG_END_Y = 334

const T_PASTE = 4.58, T_FONT = 9.14, T_BG = 9.66
const T_SEL = 11.34, T_MOUSEDOWN = 11.55, T_DRAG0 = 11.6, T_DRAG1 = 12.55, T_UP = 12.62, T_DESEL = 13.05
const SWITCHES = [4.70, 5.95, 7.66, T_FONT, 13.76] // 미리보기 텍스트가 바뀌는 순간
const ACTIVATE = [4.70, 5.95, 7.66, 13.76]         // 썸네일 i가 선택되는 순간
const CLICKS = [4.2, 5.95, 7.66, 8.04, 8.62, 9.12, 9.66, 11.34, 13.76, 14.32]
const CAPTIONS = [[2.95, 7.1], [7.35, 10.6], [10.85, 13.2], [13.45, 15.85]] // [등장, 퇴장]
const curAt = t => (t < 4.70 ? -1 : t < 5.95 ? 0 : t < 7.66 ? 1 : t < 13.76 ? 2 : 3)

// 드래그 중 실제 포인터 위치 (슬라이드 좌표)
function rawPointer(t) {
    const p = E.ioC(clamp((t - T_DRAG0) / (T_DRAG1 - T_DRAG0)))
    const dx = 58 * Math.sin(p * Math.PI) + 7 * Math.sin(p * 11)
    return {x: CX + dx, y: lerp(BOX_Y0, DRAG_END_Y, p)}
}

// 스냅이 적용된 텍스트박스 중심과 표시할 가이드라인
function boxAt(t) {
    if (t < T_DRAG0) return {x: CX, y: BOX_Y0, gx: null, gy: null}
    const r = rawPointer(t)
    let x = r.x, y = r.y, gx = null, gy = null
    if (Math.abs(r.x - CX) < SNAP) {
        x = CX
        gx = CX
    }
    for (const sy of SNAP_YS) {
        if (Math.abs(r.y - sy) < SNAP) {
            y = sy
            gy = sy
            break
        }
    }
    return {x, y, gx, gy}
}

/**
 * IntroStage.vue의 DOM(data-el 속성)을 받아 렌더러를 만든다
 * @param {HTMLElement} root - 스테이지 루트
 * @returns {{render: (t: number) => void, measure: () => void}}
 */
export function createIntroMotion(root) {
    const el = name => root.querySelector(`[data-el="${name}"]`)
    const els = name => [...root.querySelectorAll(`[data-el="${name}"]`)]
    const slideOf = node => ({
        el: node,
        img: node.querySelector('.s-img'),
        box: node.querySelector('.s-box'),
        txt: node.querySelector('.s-text'),
    })

    const g1 = el('g1'), g2 = el('g2')
    const caps = els('cap').map((node, i) => ({
        el: node,
        tin: CAPTIONS[i][0],
        tout: CAPTIONS[i][1],
        kick: node.querySelector('.kicker'),
        lines: [...node.querySelectorAll('.ln > span')],
        ems: [...node.querySelectorAll('em')],
    }))
    const cam = el('cam'), camIn = el('camIn'), mock = el('mock')
    const preview = el('preview'), mainSlide = slideOf(el('mainSlide'))
    const guideV = el('guideV'), guideH = el('guideH'), selbox = el('selbox')
    const phThumb = el('phThumb'), phSlide = slideOf(phThumb.querySelector('.slide'))
    const thumbs = els('thumb').map(node => ({el: node, slide: slideOf(node.querySelector('.slide'))}))
    const tabLyr = el('tabLyr'), tabSet = el('tabSet'), tabLine = el('tabLine')
    const ta = el('ta'), ph = el('ph'), lyr = el('lyr'), flash = el('flash')
    const caret0 = el('caret0'), caret1 = el('caret1'), btags = els('btag')
    const setPanel = el('set'), sel = el('sel'), selVal = el('selVal'), list = el('list'), optNM = el('optNM')
    const ibPal = el('ibPal'), ibImg = el('ibImg'), fColor = el('fColor'), fFile = el('fFile')
    const exportBtn = el('export'), dim = el('dim')
    const keys = el('keys'), keyCtrl = el('keyCtrl'), keyV = el('keyV')
    const fcard = el('fcard'), ficon = el('ficon'), fbar = el('fbar')
    const fs0 = el('fs0'), fs1 = el('fs1'), fcheck = el('fcheck')
    const flies = els('fly').map(node => ({el: node, slide: slideOf(node.querySelector('.slide'))}))
    const ring = el('ring'), cursor = el('cursor'), cArrow = el('cArrow'), cMove = el('cMove')

    /* ----- 목업 내부 좌표 측정 (커서가 향할 지점) ----- */
    let PV = {x: 32, y: 172}
    let TAB = {l0: 0, w0: 0, l1: 0, w1: 0}
    let T = {}
    let CAM_KF = []
    let CURSOR_KF = []

    function offs(node) {
        let x = 0, y = 0
        for (let n = node; n && n !== mock; n = n.offsetParent) {
            x += n.offsetLeft
            y += n.offsetTop
        }
        return {x, y, w: node.offsetWidth, h: node.offsetHeight}
    }

    const center = o => ({x: o.x + o.w / 2, y: o.y + o.h / 2})

    function measure() {
        const pv = offs(preview)
        PV = {x: pv.x, y: pv.y}
        const tao = offs(ta), selo = offs(sel), opto = offs(optNM)
        T = {
            ta: {x: tao.x + tao.w * 0.5, y: tao.y + 96},
            thumb: thumbs.map(th => center(offs(th.el))),
            tabSet: center(offs(tabSet)),
            fontSel: {x: selo.x + selo.w * 0.32, y: selo.y + selo.h / 2},
            optNM: {x: opto.x + 160, y: opto.y + opto.h / 2},
            bgImg: center(offs(ibImg)),
            export: center(offs(exportBtn)),
            box0: {x: PV.x + CX, y: PV.y + BOX_Y0},
        }
        const r1 = rawPointer(T_DRAG1)
        T.dragEnd = {x: PV.x + r1.x, y: PV.y + r1.y}
        T.card = {x: MOCK_CX, y: PV.y + 328} // 드래그로 내려간 가사 박스를 덮는 위치
        T.icon = {x: T.card.x - 216, y: T.card.y}
        TAB = {l0: tabLyr.offsetLeft, w0: tabLyr.offsetWidth, l1: tabSet.offsetLeft, w1: tabSet.offsetWidth}

        const fyPreview = PV.y + SH / 2
        CAM_KF = [
            [0, {z: 1, fy: MOCK_CY, ay: 0}],
            [10.8, {z: 1, fy: MOCK_CY, ay: 0}],
            [11.4, {z: 1.12, fy: fyPreview, ay: 36}],
            [13.05, {z: 1.12, fy: fyPreview, ay: 36}],
            [13.6, {z: 1, fy: MOCK_CY, ay: 0}],
        ]
        CURSOR_KF = [
            [3.55, {x: 760, y: 1215}], [3.65, {x: 760, y: 1215}],
            [4.15, T.ta], [5.55, T.ta],
            [5.90, T.thumb[1]], [7.30, T.thumb[1]],
            [7.60, T.thumb[2]], [7.70, T.thumb[2]],
            [8.00, T.tabSet], [8.28, T.tabSet],
            [8.56, T.fontSel], [8.78, T.fontSel],
            [9.06, T.optNM], [9.30, T.optNM],
            [9.60, T.bgImg], [10.95, T.bgImg],
            [11.30, T.box0], [T_MOUSEDOWN, T.box0],
            [T_UP, T.dragEnd], [13.40, T.dragEnd],
            [13.70, T.thumb[3]], [13.84, T.thumb[3]],
            [14.26, T.export], [15.10, T.export],
            [15.55, {x: T.export.x - 60, y: T.export.y + 210}],
        ]
    }

    function cursorAt(t) {
        if (t >= T_MOUSEDOWN && t <= T_UP) {
            const r = rawPointer(Math.max(t, T_DRAG0))
            return {x: PV.x + r.x, y: PV.y + r.y}
        }
        return track(t, CURSOR_KF)
    }

    function paintSlide(s, st) {
        if (s.text !== st.text) {
            s.txt.textContent = st.text
            s.text = st.text
        }
        if (s.serif !== st.serif) {
            s.el.classList.toggle('serif', st.serif)
            s.serif = st.serif
        }
        if (s.imgv !== st.img) {
            s.imgv = st.img
            s.img.style.visibility = st.img <= 0 ? 'hidden' : 'visible'
            s.img.style.clipPath = st.img >= 1 ? 'none' : `circle(${(st.img * 75).toFixed(2)}% at 50% 50%)`
        }
        s.box.style.transform = `translate3d(calc(-50% + ${(st.bx - CX).toFixed(2)}px),calc(-50% + ${(st.by - SH / 2).toFixed(2)}px),0)`
        s.box.style.opacity = st.o.toFixed(3)
    }

    function renderCaptions(t) {
        for (const c of caps) {
            const o = P(t, c.tout, 0.22, E.inC)
            if (t < c.tin - 0.02 || o >= 1) {
                op(c.el, 0)
                continue
            }
            op(c.el, 1 - o)
            tf(c.el, 0, -34 * o)
            const k = P(t, c.tin, 0.4)
            op(c.kick, k)
            tf(c.kick, 0, 20 * (1 - k))
            c.lines.forEach((ln, i) => reveal(ln, P(t, c.tin + 0.07 + i * 0.09, 0.6, E.outQ)))
            c.ems.forEach(em => sweep(em, P(t, c.tin + 0.45, 0.45, E.ioC)))
        }
    }

    function renderMock(t) {
        const cur = curAt(t), pasted = t >= T_PASTE, serif = t >= T_FONT, b = boxAt(t)
        let dipAll = 1
        for (const s of SWITCHES) {
            const d = Math.abs(t - s)
            if (d < 0.13) dipAll = Math.min(dipAll, smooth(d / 0.13))
        }
        const dF = Math.abs(t - T_FONT), dipFont = dF < 0.13 ? smooth(dF / 0.13) : 1

        // 메인 미리보기 · 스냅 가이드 · 선택 박스
        paintSlide(mainSlide, {
            text: cur < 0 ? PLACEHOLDER : LYRICS[cur], serif,
            img: P(t, 9.72, 0.5, E.ioC), bx: b.x, by: b.y, o: dipAll,
        })
        const dragging = t >= T_DRAG0 && t < T_UP
        op(guideV, dragging && b.gx != null ? 1 : 0)
        op(guideH, dragging && b.gy != null ? 1 : 0)
        if (b.gy != null) guideH.style.top = (b.gy - 1).toFixed(1) + 'px'
        op(selbox, t >= T_SEL && t < T_DESEL ? P(t, T_SEL, 0.1, E.lin) : 0)

        // 썸네일: 붙여넣기 순간 하나씩 튀어나오고, 설정은 모든 장에 함께 반영
        op(phThumb, pasted ? 1 - P(t, T_PASTE, 0.12, E.lin) : 1)
        phThumb.classList.toggle('on', !pasted)
        paintSlide(phSlide, {text: PLACEHOLDER, serif: false, img: 0, bx: CX, by: BOX_Y0, o: 1})
        thumbs.forEach((th, i) => {
            const tp = 4.70 + i * 0.13, p = P(t, tp, 0.34, E.outBack)
            const act = i === cur, a = ACTIVATE[i]
            const pulse = act && t >= a && t < a + 0.28 ? 1 + 0.07 * Math.sin(Math.PI * (t - a) / 0.28) : 1
            op(th.el, P(t, tp, 0.1, E.lin))
            tf(th.el, 0, 14 * (1 - p), lerp(0.6, 1, p) * pulse)
            th.el.classList.toggle('on', act)
            paintSlide(th.slide, {
                text: LYRICS[i], serif,
                img: P(t, 9.78 + i * 0.05, 0.4, E.ioC), bx: b.x, by: b.y, o: dipFont,
            })
        })

        // 탭 전환 (Lyrics → Settings)
        const tp = P(t, 8.04, 0.26, E.ioC)
        tabLine.style.transform = `translate3d(${lerp(TAB.l0, TAB.l1, tp).toFixed(1)}px,0,0)`
        tabLine.style.width = lerp(TAB.w0, TAB.w1, tp).toFixed(1) + 'px'
        tabLyr.classList.toggle('on', tp < 0.5)
        tabSet.classList.toggle('on', tp >= 0.5)
        op(ta, 1 - P(t, 8.04, 0.16, E.lin))
        op(setPanel, P(t, 8.12, 0.18))

        // 가사 입력창: 붙여넣기 · 빈 줄 표시
        ta.classList.toggle('focus', t >= 4.2 && t < 8.04)
        op(ph, pasted ? 0 : 1)
        lyr.style.clipPath = `inset(0 0 ${pasted ? ((1 - P(t, T_PASTE, 0.3)) * 100).toFixed(1) : 100}% 0)`
        op(flash, pasted ? 1 - P(t, T_PASTE + 0.04, 0.7, E.lin) : 0)
        const blinkOn = Math.floor(t * 2.2) % 2 === 0
        op(caret0, !pasted && t >= 4.2 && blinkOn ? 1 : 0)
        op(caret1, pasted && t < 8.04 && blinkOn ? 1 : 0)
        btags.forEach((bt, j) => {
            const t0 = 4.83 + j * 0.13, p = P(t, t0, 0.3, E.outBack)
            op(bt, P(t, t0, 0.08, E.lin) * (1 - P(t, 7.0, 0.2, E.lin)))
            tf(bt, 18 * (1 - p), 0, lerp(0.7, 1, p))
        })

        // Ctrl + V 키캡
        const kIn = P(t, 4.25, 0.25, E.outBack), kOut = P(t, 5.05, 0.2, E.inC)
        op(keys, P(t, 4.25, 0.08, E.lin) * (1 - kOut))
        tf(keys, 606, 842 + 20 * (1 - kIn) - 20 * kOut, lerp(0.7, 1, kIn))
        pressKey(keyV, t >= 4.52 && t < 4.66 ? 1 - Math.abs((t - 4.59) / 0.07) : 0)
        pressKey(keyCtrl, t >= 4.4 && t < 4.75 ? 0.8 : 0)

        // 설정 패널: 폰트 드롭다운 · 배경 이미지
        const listO = t >= 8.62 && t < 9.28 ? P(t, 8.62, 0.14) * (1 - P(t, 9.16, 0.12, E.inC)) : 0
        op(list, listO)
        list.style.transform = `translate3d(0,${(-10 * (1 - listO)).toFixed(1)}px,0) scaleY(${lerp(0.96, 1, listO).toFixed(3)})`
        sel.classList.toggle('open', t >= 8.62 && t < 9.16)
        optNM.classList.toggle('hover', t >= 9.0 && t < 9.16)
        const fontName = serif ? 'Nanum Myeongjo' : 'Arial'
        if (selVal.textContent !== fontName) selVal.textContent = fontName
        selVal.classList.toggle('serif', serif)
        const img = t >= T_BG
        ibPal.classList.toggle('on', !img)
        ibImg.classList.toggle('on', img)
        const fx = P(t, T_BG, 0.18, E.lin)
        op(fColor, 1 - fx)
        op(fFile, fx)

        // Export → 썸네일이 파일로 빨려 들어가는 카드
        exportBtn.classList.toggle('hover', t >= 14.18 && t < 15.3)
        const pr = t >= 14.32 && t < 14.6 ? P(t, 14.32, 0.26, E.outBack) : 1
        exportBtn.style.transform = `scale(${lerp(0.93, 1, pr).toFixed(4)})`
        op(dim, P(t, 14.4, 0.3, E.lin))
        if (t >= 14.4) {
            const fc = P(t, 14.4, 0.45, E.outQ)
            op(fcard, P(t, 14.4, 0.1, E.lin))
            tf(fcard,
                lerp(T.export.x, T.card.x, fc),
                lerp(T.export.y, T.card.y, fc) - 50 * Math.sin(Math.PI * fc),
                lerp(0.22, 1, fc))
            fbar.style.width = (P(t, 14.85, 0.55, E.ioC) * 100).toFixed(1) + '%'
            const done = t >= 15.42
            op(fs0, done ? 0 : 1)
            op(fs1, done ? 1 : 0)
            tf(fcheck, 0, 0, lerp(0.3, 1, P(t, 15.42, 0.35, E.outBack)))
            let pulse = 0
            for (let i = 0; i < flies.length; i++) {
                const landed = 14.97 + i * 0.07
                if (t >= landed) pulse = Math.max(pulse, 1 - P(t, landed, 0.2, E.lin))
            }
            ficon.style.transform = `scale(${(1 + 0.08 * pulse).toFixed(3)})`
        } else {
            op(fcard, 0)
        }
        flies.forEach((f, i) => {
            const t0 = 14.55 + i * 0.07, p = clamp((t - t0) / 0.42)
            if (t < t0 || p >= 1) {
                op(f.el, 0)
                return
            }
            // 썸네일 → 파일 아이콘으로 휘어 날아가는 2차 베지어 (제어점: 썸네일 x, 아이콘 y)
            const pe = E.ioC(p), q = 1 - pe, a = T.thumb[i], c = T.icon
            op(f.el, p < 0.8 ? 1 : 1 - (p - 0.8) / 0.2)
            tf(f.el,
                q * q * a.x + 2 * q * pe * a.x + pe * pe * c.x,
                q * q * a.y + 2 * q * pe * c.y + pe * pe * c.y,
                lerp(1, 0.28, pe), lerp(0, -10, pe))
            paintSlide(f.slide, {text: LYRICS[i], serif: true, img: 1, bx: b.x, by: b.y, o: 1})
        })

        // 커서 · 클릭 링
        const cp = cursorAt(t), moving = t >= T_MOUSEDOWN && t < T_UP
        op(cursor, P(t, 3.55, 0.2, E.lin) * (1 - P(t, 15.5, 0.3, E.lin)))
        let press = moving ? 0.92 : 1
        for (const ck of CLICKS) if (t >= ck && t < ck + 0.14) press = lerp(0.84, 1, (t - ck) / 0.14)
        cArrow.style.display = moving ? 'none' : 'block'
        cMove.style.display = moving ? 'block' : 'none'
        const hx = moving ? 23 : 7.7, hy = moving ? 23 : 4.8 // 커서 핫스팟
        cursor.style.transformOrigin = `${hx}px ${hy}px`
        tf(cursor, cp.x - hx, cp.y - hy, press)
        let rc = -1
        for (const ck of CLICKS) if (t >= ck && t < ck + 0.45) rc = ck
        if (rc >= 0) {
            const p = (t - rc) / 0.45, rp = cursorAt(rc)
            op(ring, 0.9 * (1 - p))
            tf(ring, rp.x, rp.y, lerp(0.35, 1.5, E.outC(p)))
        } else {
            op(ring, 0)
        }
    }

    function render(t) {
        // 배경 글로우는 천천히 떠다닌다
        tf(g1, 260 + 90 * Math.sin(t * 0.42) - 750, -160 + 70 * Math.cos(t * 0.33) - 750)
        tf(g2, 860 + 70 * Math.cos(t * 0.37) - 600, STAGE_H - 180 + 60 * Math.sin(t * 0.45) - 600)

        renderCaptions(t)

        // 카메라: 포커스 지점(fy)이 제자리에 머물도록 줌
        const cm = track(t, CAM_KF), sc = MOCK_SCALE * cm.z
        cam.style.transform = `translate3d(${(STAGE_W / 2 - sc * MOCK_CX).toFixed(2)}px,${(MOCK_TOP + MOCK_SCALE * cm.fy * (1 - cm.z) + cm.ay).toFixed(2)}px,0) scale(${sc.toFixed(4)})`
        // 목업 등장: 아래에서 세워지며 올라온다
        const pe = P(t, 2.9, 0.85, E.outQ)
        op(camIn, P(t, 2.9, 0.25, E.lin))
        camIn.style.transform = `translate3d(0,${(460 * (1 - pe)).toFixed(1)}px,0) rotateX(${(18 * (1 - pe)).toFixed(2)}deg) scale(${lerp(0.94, 1, pe).toFixed(4)})`

        renderMock(t)
    }

    measure()
    return {render, measure}
}
