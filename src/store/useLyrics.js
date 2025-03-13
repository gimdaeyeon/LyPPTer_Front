import {defineStore} from "pinia";
import {reactive, ref} from "vue";

export const useLyrics = defineStore('lyrics',()=>{
    const slides = ref([]);
    const currentSlideIndex = ref(0)
    const lyrics = ref('가나다라');

    const settings = reactive({
        fontSize : 30,
        textColor : '#FFFFFF',
        textAlign : 'center',
        positionX : 175,
        positionY : 70,
        textBoxWidth : 400,
        textBoxHeight : 50,
        isBgImg : false,
        bgColor : '#000000',
    });

    return {
        lyrics, slides,currentSlideIndex, settings,
    }
});