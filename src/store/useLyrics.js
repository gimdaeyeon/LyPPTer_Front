import {defineStore} from "pinia";
import {ref} from "vue";

export const useLyrics = defineStore('lyrics',()=>{
    const lyrics = ref('가나다라');
    const fontSize = ref(30);
    const textAlign = ref('center');
    const positionX = ref(30);
    const positionY = ref(50);
    const textBoxWidth = ref(400);
    const textBoxHeight = ref(200);
    const isBgImg = ref(false);
    const bgColor= ref('#000000');

    return {
        lyrics,fontSize, textAlign,
        positionX, positionY, textBoxWidth,
        textBoxHeight, isBgImg, bgColor,
    }
});