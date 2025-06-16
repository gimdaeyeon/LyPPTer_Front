import PptxGenJS from "pptxgenjs";
import {useLyrics} from "@/store/useLyrics.js";
import {storeToRefs} from "pinia";
import {toRefs} from "vue";
import {getDate} from "@/utils/dateUtils.js";
import {pxToInch, relPxToIn} from "@/utils/utils.js";

export function createPPt() {
    const lyricsStore = useLyrics();
    const {lyricsSlides, title, bgDataUrl} = storeToRefs(lyricsStore);
    const {
        fontSize, textBoxWidth, textBoxHeight,
        textColor, bgColor, positionX, positionY, textAlign,
        canvasWidth, canvasHeight, isBgImg,
        isTextBold,fontFamily,
    } = toRefs(lyricsStore.settings);

    const pres = new PptxGenJS;
    const colorBgMaster = 'COLOR_BG';
    const imageBgMaster = 'IMAGE_BG';
    const SLIDE_W = 10;      // inch
    const SLIDE_H = 5.625;   // inch

    pres.defineSlideMaster({
        title: colorBgMaster,
        background: {color: bgColor.value.replace('#',''),},
    });

    pres.defineSlideMaster({
        title: imageBgMaster,
        background: {
            data: bgDataUrl.value,
            // path: 'https://../bg.jpg' // 외부 URL
        },
    });

    lyricsSlides.value.forEach(lyrics => {
        /* --- ① 폭·높이(px → in) -------------------------------- */
        const wIn = relPxToIn(textBoxWidth.value,  canvasWidth.value,  SLIDE_W);
        const hIn = relPxToIn(textBoxHeight.value, canvasHeight.value, SLIDE_H);

        /* --- ② 중심(px → in) ----------------------------------- */
        const centerXIn = relPxToIn(positionX.value, canvasWidth.value,  SLIDE_W);
        const centerYIn = relPxToIn(positionY.value, canvasHeight.value, SLIDE_H);

        /* --- ③ PPT는 좌상단 기준 → ½ 폭·높이 빼 줌 -------------- */
        const xIn = centerXIn - wIn / 2;
        const yIn = centerYIn - hIn / 2;

        const slide = pres.addSlide({
            masterName: isBgImg.value && bgDataUrl.value ? imageBgMaster : colorBgMaster,
        });
        slide.addText(lyrics, {
            x: xIn,
            y: yIn,
            w: wIn,
            h: hIn,
            // y: pxToInch(positionY.value - textBoxHeight.value / 2),
            // w: '100%',
            color: textColor.value.replace('#',''),
            align: textAlign.value,
            fontSize: fontSize.value,
            bold: isTextBold.value,
            fontFace:fontFamily.value,
        });
    })

//     4. Save the Presentation
    pres.writeFile({fileName: title.value || getDate()});
}