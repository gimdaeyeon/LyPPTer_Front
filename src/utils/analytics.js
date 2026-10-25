/**
 * Umami 커스텀 이벤트 전송 (스크립트는 index.html에서 로드)
 * - 스크립트가 아직 안 불렸거나 광고 차단기에 막혀도 앱 동작에는 영향이 없게 조용히 넘어간다
 * - index.html의 data-domains 설정으로 실제 도메인(lyppter.com)에서만 집계된다
 * @param {string} name - 이벤트 이름
 * @param {Object} [data] - 함께 남길 값 (문자열·숫자·불리언)
 */
export function track(name, data) {
    try {
        window.umami?.track(name, data)
    } catch {
        // 통계 전송 실패는 무시
    }
}

const sent = new Set()

/** 페이지를 연 뒤 처음 한 번만 보낸다 (자주 일어나는 동작을 "써 본 사람 수"로 세기 위해) */
export function trackOnce(name, data) {
    if (sent.has(name)) return
    sent.add(name)
    track(name, data)
}
