import {defineStore} from "pinia";
import {computed, reactive, ref, watch} from "vue";

export const useLyrics = defineStore('lyrics', () => {
    const currentSlideIdx = ref(0); // 현재 활성 슬라이드 인덱스
    const lyrics = ref('가사를 입력하세요'); // 사용자가 입력한 전체 가사

    // 슬라이드 옵션
    const settings = reactive({
        fontSize: 30,
        textColor: '#FFFFFF',
        textAlign: 'center',
        positionX: 175,
        positionY: 70,
        textBoxWidth: 400,
        textBoxHeight: 50,
        isBgImg: false,
        bgImg: null,
        bgColor: '#000000',
        canvasWidth:0,
        canvasHeight:0,
    });

    const currentLyrics = computed(()=>{
        const lines = lyrics.value.trim().split(/(?:\r?\n){2,}/).map(line => line.trim());
        return lines[currentSlideIdx.value];
    });

    const lyricsSlides = computed(()=> lyrics.value.trim().split(/(?:\r?\n){2,}/).map(line => line.trim()));

    watch(lyrics, (newLyrics) => {
        lyrics.value = newLyrics.replace(/(?:\r?\n){2,}/g, '\n\n');
    });


    // 가사를 분할하여 슬라이드 생성
    // function generateSlides() {
    //     const lines = lyrics.value.split(/(?:\r?\n){2,}/).map(line => line.trim())
    //         .filter(line => line !== "");
    //
    //     // 현재 슬라이드 개수와 비교하여 추가/삭제
    //     while (slides.length < lines.length) {
    //         slides.push({text: "", canvas: null});
    //     }
    //     while (slides.length > lines.length) {
    //         slides.pop()
    //     }
    //
    //     slides.forEach((slide, index) => {
    //         slide.text = lines[index];
    //     });
    //
    // }
    // // lyrics 값이 변경 될 때 슬라이드 자동 생성
    // watch(lyrics, generateSlides);

    return {
        lyrics, currentSlideIdx, settings, currentLyrics,
        lyricsSlides,
    }
});