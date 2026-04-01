import {ref} from 'vue'
import {SLIDE_W, SLIDE_H} from '@/utils/pptUnits.js'

/**
 * 텍스트박스 드래그 composable
 * @param {Ref} containerRef - 슬라이드 컨테이너 DOM ref
 * @param {Function} onUpdate - (newX, newY) 콜백 (inches)
 */
export function useTextBoxDrag(containerRef, onUpdate) {
    const isDragging = ref(false)
    let startX = 0, startY = 0
    let startPosX = 0, startPosY = 0

    function onPointerDown(e, posX, posY) {
        if (e.button !== 0) return
        isDragging.value = true
        startX = e.clientX
        startY = e.clientY
        startPosX = posX
        startPosY = posY
        e.target.setPointerCapture(e.pointerId)

        const onMove = (ev) => {
            if (!isDragging.value) return
            const rect = containerRef.value.getBoundingClientRect()
            const dx = (ev.clientX - startX) / rect.width * SLIDE_W
            const dy = (ev.clientY - startY) / rect.height * SLIDE_H
            const newX = Math.max(0, Math.min(SLIDE_W, startPosX + dx))
            const newY = Math.max(0, Math.min(SLIDE_H, startPosY + dy))
            onUpdate(round2(newX), round2(newY))
        }

        const onUp = () => {
            isDragging.value = false
            window.removeEventListener('pointermove', onMove)
            window.removeEventListener('pointerup', onUp)
        }

        window.addEventListener('pointermove', onMove)
        window.addEventListener('pointerup', onUp)
    }

    return {isDragging, onPointerDown}
}

function round2(v) {
    return Math.round(v * 100) / 100
}
