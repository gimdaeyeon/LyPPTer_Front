import PptxGenJS from "pptxgenjs";
import {useLyrics} from "@/store/useLyrics.js";
import {storeToRefs} from "pinia";
import {toRefs} from "vue";
import {getDate} from "@/util/dateUtils.js";

export function createPPt() {
    const lyricsStore = useLyrics();
    const {lyricsSlides, title} = storeToRefs(lyricsStore);
    const {
        fontSize, textBoxWidth, textBoxHeight,
        textColor, bgColor, positionX, positionY, textAlign,
        canvasWidth, canvasHeight, isBgImg,
        isTextBold,
    } = toRefs(lyricsStore.settings);

    // 1. Create a Presentation
    const pres = new PptxGenJS;
    const masterName = 'LYRICS_BG'

    pres.defineSlideMaster({
        title: masterName,
        background: {color: bgColor.value},

    });

    lyricsSlides.value.forEach(lyrics => {
        const slide = pres.addSlide({masterName});

        slide.addText(lyrics, {
            x: 1.5,
            y: 1.5,
            color: textColor.value,
            align: textAlign.value,
            fontSize:fontSize.value,
            bold: isTextBold.value,
        });
    })

//     4. Save the Presentation
    pres.writeFile({fileName: title.value||getDate()});
}