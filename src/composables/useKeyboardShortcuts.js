import {onMounted, onUnmounted} from 'vue'
import {useLyrics} from '@/store/useLyrics.js'
import {createPPt} from '@/services/pptService.js'

/**
 * 전역 키보드 단축키 등록
 * - Ctrl+Z: Undo
 * - Ctrl+Shift+Z / Ctrl+Y: Redo
 * - Ctrl+E: Export PPT
 * - ArrowUp/Down: 슬라이드 이동
 * - Delete: 슬라이드 삭제
 * - Ctrl+D: 슬라이드 복제
 * - Escape: 선택 해제 (SlidePreview 내부에서 처리)
 */
export function useKeyboardShortcuts() {
    const store = useLyrics()

    function isInEditor(e) {
        const tag = e.target.tagName
        return tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable
    }

    function handler(e) {
        const ctrl = e.ctrlKey || e.metaKey

        // Ctrl+Z — Undo (입력 필드에서도 동작)
        if (ctrl && !e.shiftKey && e.key === 'z') {
            e.preventDefault()
            store.undo()
            return
        }

        // Ctrl+Shift+Z / Ctrl+Y — Redo
        if (ctrl && e.shiftKey && e.key === 'z') {
            e.preventDefault()
            store.redo()
            return
        }
        if (ctrl && e.key === 'y') {
            e.preventDefault()
            store.redo()
            return
        }

        // 입력 필드 안에서는 아래 단축키 무시
        if (isInEditor(e)) return

        // Ctrl+E — Export
        if (ctrl && e.key === 'e') {
            e.preventDefault()
            createPPt()
            return
        }

        // Ctrl+D — 슬라이드 복제
        if (ctrl && e.key === 'd') {
            e.preventDefault()
            store.snapshotNow()
            store.duplicateSlide(store.currentSlideIdx)
            return
        }

        // ArrowUp — 이전 슬라이드
        if (e.key === 'ArrowUp') {
            e.preventDefault()
            if (store.currentSlideIdx > 0) {
                store.currentSlideIdx--
            }
            return
        }

        // ArrowDown — 다음 슬라이드
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            if (store.currentSlideIdx < store.lyricsSlides.length - 1) {
                store.currentSlideIdx++
            }
            return
        }

        // Delete — 슬라이드 삭제
        if (e.key === 'Delete') {
            if (store.lyricsSlides.length > 1) {
                store.snapshotNow()
                store.deleteSlide(store.currentSlideIdx)
            }
            return
        }
    }

    onMounted(() => window.addEventListener('keydown', handler))
    onUnmounted(() => window.removeEventListener('keydown', handler))
}
