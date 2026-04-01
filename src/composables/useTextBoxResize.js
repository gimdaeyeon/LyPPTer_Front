import {ref} from 'vue'
import {SLIDE_W} from '@/utils/pptUnits.js'

/**
 * 텍스트박스 리사이즈 composable (좌/우 핸들)
 * positionX는 중심점 기준이므로, 한쪽만 늘리면 중심도 이동
 * @param {Ref} containerRef - 슬라이드 컨테이너 DOM ref
 * @param {Function} onUpdate - (newWidth, newX) 콜백 (inches)
 */
export function useTextBoxResize(containerRef, onUpdate) {
    const isResizing = ref(false)
    let startMouseX = 0
    let startWidth = 0
    let startPosX = 0
    let direction = ''

    function onPointerDown(e, dir, width, posX) {
        if (e.button !== 0) return
        e.stopPropagation()
        isResizing.value = true
        direction = dir
        startMouseX = e.clientX
        startWidth = width
        startPosX = posX
        e.target.setPointerCapture(e.pointerId)

        const onMove = (ev) => {
            if (!isResizing.value) return
            const rect = containerRef.value.getBoundingClientRect()
            const dxInches = (ev.clientX - startMouseX) / rect.width * SLIDE_W

            let newWidth, newX
            if (direction === 'e') {
                // 동쪽: 오른쪽 확장, 중심점은 오른쪽으로 절반 이동
                newWidth = Math.max(1, startWidth + dxInches)
                newX = startPosX + dxInches / 2
            } else {
                // 서쪽: 왼쪽 확장, 중심점은 왼쪽으로 절반 이동
                newWidth = Math.max(1, startWidth - dxInches)
                newX = startPosX + dxInches / 2
            }

            newWidth = Math.min(newWidth, SLIDE_W)
            newX = Math.max(newWidth / 2, Math.min(SLIDE_W - newWidth / 2, newX))

            onUpdate(round2(newWidth), round2(newX))
        }

        const onUp = () => {
            isResizing.value = false
            window.removeEventListener('pointermove', onMove)
            window.removeEventListener('pointerup', onUp)
        }

        window.addEventListener('pointermove', onMove)
        window.addEventListener('pointerup', onUp)
    }

    return {isResizing, onPointerDown}
}

function round2(v) {
    return Math.round(v * 100) / 100
}
