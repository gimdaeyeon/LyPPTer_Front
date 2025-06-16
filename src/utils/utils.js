export function pxToInch(px) {
    return px/96;
}

export const relPxToIn = (px, canvasPx, slideIn) => (px / canvasPx) * slideIn;