import {ref} from 'vue'

const STORAGE_KEY = 'lyppter_intro_seen_v1'

const isIntroOpen = ref(false)

/**
 * 첫 방문 인트로 팝업 상태
 * - 한 번 닫으면 localStorage에 기록해 다시 자동으로 띄우지 않는다
 * - 헤더의 ? 버튼으로 언제든 다시 열 수 있다
 */
export function useIntro() {
    function openIntro() {
        isIntroOpen.value = true
    }

    function closeIntro() {
        isIntroOpen.value = false
        localStorage.setItem(STORAGE_KEY, '1')
    }

    function openIntroIfFirstVisit() {
        if (!localStorage.getItem(STORAGE_KEY)) openIntro()
    }

    return {isIntroOpen, openIntro, closeIntro, openIntroIfFirstVisit}
}
