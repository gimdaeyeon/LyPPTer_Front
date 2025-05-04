import PptxGenJS from "pptxgenjs";
import {useLyrics} from "@/store/useLyrics.js";
import {storeToRefs} from "pinia";
import {toRefs} from "vue";

export function createPPt() {
    const lyricsStore = useLyrics();
    const {lyricsSlides} = storeToRefs(lyricsStore);
    const {
        fontSize, textBoxWidth, textBoxHeight,
        textColor, bgColor, positionX, positionY, textAlign,
        canvasWidth, canvasHeight, isBgImg,
    } = toRefs(lyricsStore.settings);

    // 1. Create a Presentation
    const pres = new PptxGenJS;
    pres.defineSlideMaster({
        title: 'LYRICS_BG',
        background: {color: bgColor.value},
    });

    lyricsSlides.value.forEach(lyrics => {
        const slide = pres.addSlide({masterName: 'LYRICS_BG'});

        slide.addText(lyrics, {
            x: 1.5,
            y: 1.5,
            color: textColor.value,
            align: textAlign.value,
        });
    })

//     4. Save the Presentation
    pres.writeFile({fileName: 'Sample.pptx'});
}