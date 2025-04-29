import PptxGenJS from "pptxgenjs";
import {useLyrics} from "@/store/useLyrics.js";
import {storeToRefs} from "pinia";
import {toRefs} from "vue";

export function createPPt() {
    const lyricsStore = useLyrics();
    const {lyricsSlides} = storeToRefs(lyricsStore);
    // const {
    //     fontSize, textBoxWidth, textBoxHeight,
    //     textColor, bgColor, positionX, positionY, textAlign,
    //     canvasWidth, canvasHeight,isBgImg,
    // } = toRefs(lyricsStore.settings);

    // 1. Create a Presentation
    const pres = new PptxGenJS;

    lyricsSlides.value.forEach(lyrics=>{
        const slide = pres.addSlide();

        slide.addText(lyrics,{
            x:1.5,
            y:1.5,
            color:"363636",
            fill:{color:'#F1F1F1'},
            align: pres.AlignH.center,
        });
    })

//     4. Save the Presentation
    pres.writeFile({fileName:'Smple.pptx'});
}