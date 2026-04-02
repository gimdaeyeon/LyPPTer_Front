import {ref} from 'vue'
import {SLIDE_W, SLIDE_H} from '@/utils/pptUnits.js'
import {round2} from '@/utils/math.js'
import {usePointerTrack} from '@/composables/usePointerTrack.js'

/**
 * 텍스트박스 드래그 composable
 * @param {Ref} containerRef - 슬라이드 컨테이너 DOM ref
 * @param {Function} onUpdate - (newX, newY) 콜백 (inches)
 * @param {Function|null} getBoxDims - () => { width, height } (inches), 스냅용
 * @param {Object|null} snapGuides - useSnapGuides() 반환값
 * @returns cleanup - onUnmounted에서 호출하여 드래그 중 언마운트 시 리스너 정리
 */
export function useTextBoxDrag(containerRef, onUpdate, getBoxDims = null, snapGuides = null) {
    const isDragging = ref(false)
    let startX = 0, startY = 0
    let startPosX = 0, startPosY = 0
    const {start: trackStart, stop: trackStop} = usePointerTrack()

    function onPointerDown(e, posX, posY) {
        if (e.button !== 0) return
        isDragging.value = true
        startX = e.clientX
        startY = e.clientY
        startPosX = posX
        startPosY = posY

        trackStart(
            e,
            (ev) => {
                if (!isDragging.value) return
                const rect = containerRef.value.getBoundingClientRect()
                const dx = (ev.clientX - startX) / rect.width * SLIDE_W
                const dy = (ev.clientY - startY) / rect.height * SLIDE_H
                let newX = Math.max(0, Math.min(SLIDE_W, startPosX + dx))
                let newY = Math.max(0, Math.min(SLIDE_H, startPosY + dy))
                if (snapGuides && getBoxDims) {
                    const {height} = getBoxDims()
                    const {snappedX, snappedY} = snapGuides.applySnap(newX, newY, height)
                    newX = snappedX
                    newY = snappedY
                }
                onUpdate(round2(newX), round2(newY))
            },
            () => {
                isDragging.value = false
                if (snapGuides) snapGuides.reset()
            }
        )
    }

    return {isDragging, onPointerDown, cleanup: trackStop}
}
