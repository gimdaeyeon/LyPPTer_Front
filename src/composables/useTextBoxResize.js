import {ref} from 'vue'
import {SLIDE_W, SLIDE_H} from '@/utils/pptUnits.js'
import {round2} from '@/utils/math.js'
import {usePointerTrack} from '@/composables/usePointerTrack.js'
import {TEXT_BOX_MIN_WIDTH, TEXT_BOX_MIN_HEIGHT} from '@/utils/constants.js'

/**
 * 텍스트박스 리사이즈 composable (8방향)
 * positionX/Y는 중심점 기준
 * @param {Ref} containerRef - 슬라이드 컨테이너 DOM ref
 * @param {Function} onUpdate - ({ width, height, x, y }) 콜백 (inches)
 * @returns cleanup - onUnmounted에서 호출하여 리사이즈 중 언마운트 시 리스너 정리
 */
export function useTextBoxResize(containerRef, onUpdate) {
    const isResizing = ref(false)
    let startMouseX = 0, startMouseY = 0
    let startWidth = 0, startHeight = 0
    let startPosX = 0, startPosY = 0
    let direction = ''
    const {start: trackStart, stop: trackStop} = usePointerTrack()

    function onPointerDown(e, dir, dims) {
        if (e.button !== 0) return
        e.stopPropagation()
        isResizing.value = true
        direction = dir
        startMouseX = e.clientX
        startMouseY = e.clientY
        startWidth = dims.width
        startHeight = dims.height
        startPosX = dims.x
        startPosY = dims.y

        trackStart(
            e,
            (ev) => {
                if (!isResizing.value) return
                const rect = containerRef.value.getBoundingClientRect()
                const dx = (ev.clientX - startMouseX) / rect.width * SLIDE_W
                const dy = (ev.clientY - startMouseY) / rect.height * SLIDE_H

                let w = startWidth, h = startHeight, x = startPosX, y = startPosY

                // 가로 방향
                if (direction.includes('e')) {
                    w = startWidth + dx
                    x = startPosX + dx / 2
                } else if (direction.includes('w')) {
                    w = startWidth - dx
                    x = startPosX + dx / 2
                }

                // 세로 방향
                if (direction.includes('s')) {
                    h = startHeight + dy
                    y = startPosY + dy / 2
                } else if (direction.includes('n')) {
                    h = startHeight - dy
                    y = startPosY + dy / 2
                }

                w = Math.max(TEXT_BOX_MIN_WIDTH, Math.min(w, SLIDE_W))
                h = Math.max(TEXT_BOX_MIN_HEIGHT, Math.min(h, SLIDE_H))
                x = Math.max(w / 2, Math.min(SLIDE_W - w / 2, x))
                y = Math.max(h / 2, Math.min(SLIDE_H - h / 2, y))

                onUpdate({
                    width: round2(w), height: round2(h),
                    x: round2(x), y: round2(y),
                })
            },
            () => {
                isResizing.value = false
            }
        )
    }

    return {isResizing, onPointerDown, cleanup: trackStop}
}
