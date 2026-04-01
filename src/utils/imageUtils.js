export async function makeThumbDataUrl(base64, max = 320, quality = 0.6) {
    // 1) 이미지 완전히 로드
    const img = new Image();
    img.decoding = 'async';
    img.src = base64;
    await img.decode();                 // <— 로드·디코드 완료 보장

    // 2) 리사이즈 크기 계산
    const scale = max / Math.max(img.width, img.height);
    const w = Math.round(img.width * scale);
    const h = Math.round(img.height * scale);

    // 3) 캔버스에 그려 JPEG(또는 WebP)로 압축
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    canvas.getContext('2d').drawImage(img, 0, 0, w, h);

    return canvas.toDataURL('image/jpeg', quality); // 용량 10~20 KB 수준
}
