/**
 * 앱 전역 상수 정의
 * 분산된 매직 넘버를 중앙화하여 유지보수성 향상
 */

// 스냅 동작 임계값 (inches)
export const SNAP_THRESHOLD_INCHES = 0.3

// 텍스트박스 최소 크기 (inches)
export const TEXT_BOX_MIN_WIDTH = 0.5
export const TEXT_BOX_MIN_HEIGHT = 0.3

// 슬라이드 설정 기본값 (PPT 네이티브 단위: pt / inches)
export const DEFAULT_FONT_SIZE_PT = 24
export const DEFAULT_POSITION_X = 5.0
export const DEFAULT_POSITION_Y = 1.25
export const DEFAULT_TEXT_BOX_WIDTH = 8.5
export const DEFAULT_TEXT_BOX_HEIGHT = 1.5
export const DEFAULT_LINE_SPACING = 1.0

// 리사이즈 핸들 정의 (8방향) — 컴포넌트 인스턴스마다 재생성되지 않도록 모듈 레벨에 선언
export const RESIZE_HANDLES = [
    // 변 (상하좌우)
    {dir: 'n', style: {top: 0, left: '50%', transform: 'translate(-50%, -50%)'}, cursor: 'cursor-ns-resize'},
    {dir: 's', style: {bottom: 0, left: '50%', transform: 'translate(-50%, 50%)'}, cursor: 'cursor-ns-resize'},
    {dir: 'w', style: {left: 0, top: '50%', transform: 'translate(-50%, -50%)'}, cursor: 'cursor-ew-resize'},
    {dir: 'e', style: {right: 0, top: '50%', transform: 'translate(50%, -50%)'}, cursor: 'cursor-ew-resize'},
    // 모서리
    {dir: 'nw', style: {top: 0, left: 0, transform: 'translate(-50%, -50%)'}, cursor: 'cursor-nwse-resize'},
    {dir: 'ne', style: {top: 0, right: 0, transform: 'translate(50%, -50%)'}, cursor: 'cursor-nesw-resize'},
    {dir: 'sw', style: {bottom: 0, left: 0, transform: 'translate(-50%, 50%)'}, cursor: 'cursor-nesw-resize'},
    {dir: 'se', style: {bottom: 0, right: 0, transform: 'translate(50%, 50%)'}, cursor: 'cursor-nwse-resize'},
]
