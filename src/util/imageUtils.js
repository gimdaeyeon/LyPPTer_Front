import {FabricImage} from "fabric";

export function loadImageElement(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

export async function getFabricImage(imgDataUrl, canvasWidth, canvasHeight){
    const imgElement = await loadImageElement(imgDataUrl);
    const fabricImage = new FabricImage(imgElement);
    const scale = Math.max(
        canvasWidth/fabricImage.width,
        canvasHeight/fabricImage.height
    );

    fabricImage.scale(scale);
    fabricImage.set({
        left: (canvasWidth - fabricImage.getScaledWidth()) / 2,
        top: (canvasHeight - fabricImage.getScaledHeight()) / 2,
        originX: 'left',
        originY: 'top'
    });
    return fabricImage;
}