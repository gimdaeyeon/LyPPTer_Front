import PptxGenJS from "pptxgenjs";
import {useLyrics} from "@/store/useLyrics.js";
import {storeToRefs} from "pinia";
import {toRefs} from "vue";
import {getDate} from "@/util/dateUtils.js";

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
    const colorBgMaster = 'COLOR_BG'
    const imageBgMaster = 'IMAGE_BG'

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
        const slide = pres.addSlide({
            masterName: isBgImg.value && bgDataUrl.value ? imageBgMaster : colorBgMaster,
        });

        slide.addText(lyrics, {
            x: 1.5,
            y: 1.5,
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