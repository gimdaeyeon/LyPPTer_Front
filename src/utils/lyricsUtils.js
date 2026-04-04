/**
 * 가사 슬라이드 분리/정규화 유틸리티
 * useLyrics.js, LyricsInput.vue 등에서 중복 사용하던 정규식을 통합
 */

export function splitSlides(lyrics) {
    return lyrics.replace(/\r\n/g, '\n').trim().split('\n\n')
}

export function normalizeNewlines(text) {
    return text.replace(/(?:\r?\n){2,}/g, '\n\n')
}
