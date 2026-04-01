// PPT 슬라이드 기본 치수 (16:9 와이드스크린)
export const SLIDE_W = 10       // inches
export const SLIDE_H = 5.625    // inches
export const PT_PER_INCH = 72

// PPT inches → canvas pixels
export const inToPx = (inches, canvasPx, slideIn) => (inches / slideIn) * canvasPx

// canvas pixels → PPT inches
export const pxToIn = (px, canvasPx, slideIn) => (px / canvasPx) * slideIn

// PPT pt → canvas pixels (캔버스 크기에 비례 스케일링)
export const ptToPx = (pt, canvasPx, slideIn) => pt * (canvasPx / (slideIn * PT_PER_INCH))

// canvas pixels → PPT pt
export const pxToPt = (px, canvasPx, slideIn) => px / (canvasPx / (slideIn * PT_PER_INCH))
