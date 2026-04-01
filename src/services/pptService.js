import PptxGenJS from "pptxgenjs";
import {useLyrics} from "@/store/useLyrics.js";
import {storeToRefs} from "pinia";
import {toRefs} from "vue";
import {getDate} from "@/utils/dateUtils.js";

export function createPPt() {
    const lyricsStore = useLyrics();
    const {lyricsSlides, title, bgDataUrl} = storeToRefs(lyricsStore);
    const {
        fontSize, textBoxWidth, textBoxHeight,
        textColor, bgColor, positionX, positionY, textAlign,
        isBgImg, isTextBold, fontFamily, lineSpacing,
    } = toRefs(lyricsStore.settings);

    const pres = new PptxGenJS;
    const colorBgMaster = 'COLOR_BG';
    const imageBgMaster = 'IMAGE_BG';

    pres.defineSlideMaster({
        title: colorBgMaster,
        background: {color: bgColor.value.replace('#', ''),},
    });

    pres.defineSlideMaster({
        title: imageBgMaster,
        background: {
            data: bgDataUrl.value,
        },
    });

    // 스토어 값이 이미 PPT 네이티브 단위(pt/inches)이므로 변환 불필요
    lyricsSlides.value.forEach(lyrics => {
        // center → top-left 변환 (PPT는 좌상단 기준)
        const xIn = positionX.value - textBoxWidth.value / 2;
        const yIn = positionY.value - textBoxHeight.value / 2;

        const slide = pres.addSlide({
            masterName: isBgImg.value && bgDataUrl.value ? imageBgMaster : colorBgMaster,
        });
        slide.addText(lyrics, {
            x: xIn,
            y: yIn,
            w: textBoxWidth.value,
            h: textBoxHeight.value,
            color: textColor.value.replace('#', ''),
            align: textAlign.value,
            fontSize: fontSize.value,
            bold: isTextBold.value,
            fontFace: fontFamily.value,
            lineSpacingMultiple: lineSpacing.value,
        });
    })

    pres.writeFile({fileName: title.value || getDate()});
}
