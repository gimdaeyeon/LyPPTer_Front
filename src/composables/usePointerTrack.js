/**
 * 포인터 추적 composable
 * setPointerCapture + window 이벤트 리스너 패턴을 추상화
 *
 * 사용하는 컴포넌트의 onUnmounted에서 stop()을 호출하면
 * 드래그/리사이즈 도중 컴포넌트가 언마운트되어도 리스너가 정리됨
 */
export function usePointerTrack() {
    let activeMove = null
    let activeUp = null

    function start(e, onMove, onUp) {
        e.target.setPointerCapture(e.pointerId)
        activeMove = onMove
        activeUp = () => {
            onUp()
            stop()
        }
        window.addEventListener('pointermove', activeMove)
        window.addEventListener('pointerup', activeUp)
    }

    function stop() {
        if (activeMove) window.removeEventListener('pointermove', activeMove)
        if (activeUp) window.removeEventListener('pointerup', activeUp)
        activeMove = null
        activeUp = null
    }

    return {start, stop}
}
