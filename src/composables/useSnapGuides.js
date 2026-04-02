import {ref} from 'vue'
import {SLIDE_W, SLIDE_H} from '@/utils/pptUnits.js'
import {SNAP_THRESHOLD_INCHES} from '@/utils/constants.js'

export function useSnapGuides() {
    const snapX = ref(null) // 수직 가이드라인 위치 (inches), null이면 비활성
    const snapY = ref(null) // 수평 가이드라인 위치 (inches), null이면 비활성

    function applySnap(rawX, rawY, boxHeight) {
        // X 스냅: 텍스트박스 중심 → 슬라이드 수평 중심
        let snappedX = rawX
        snapX.value = null
        if (Math.abs(rawX - SLIDE_W / 2) < SNAP_THRESHOLD_INCHES) {
            snappedX = SLIDE_W / 2
            snapX.value = SLIDE_W / 2
        }

        // Y 스냅: 텍스트박스 중심 → 슬라이드 1/3, 중앙, 2/3
        const snapPointsY = [
            SLIDE_H / 3 - boxHeight / 2,
            SLIDE_H / 2 - boxHeight / 2,
            2 * SLIDE_H / 3 - boxHeight / 2,
        ]
        const guidePointsY = [SLIDE_H / 3, SLIDE_H / 2, 2 * SLIDE_H / 3]
        let snappedY = rawY
        snapY.value = null
        for (let i = 0; i < snapPointsY.length; i++) {
            if (Math.abs(rawY - snapPointsY[i]) < SNAP_THRESHOLD_INCHES) {
                snappedY = snapPointsY[i]
                snapY.value = guidePointsY[i]
                break
            }
        }

        return {snappedX, snappedY}
    }

    function reset() {
        snapX.value = null
        snapY.value = null
    }

    return {applySnap, reset, snapX, snapY}
}
