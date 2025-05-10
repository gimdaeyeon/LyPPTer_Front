import {defineStore} from "pinia";
import {computed, reactive, ref, watch} from "vue";

export const useLyrics = defineStore('lyrics', () => {
    const currentSlideIdx = ref(0); // 현재 활성 슬라이드 인덱스
    const lyrics = ref('가사를 입력하세요'); // 사용자가 입력한 전체 가사
    const title = ref('')

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
        bgColor: '#000000',
        canvasWidth:0,
        canvasHeight:0,
        isTextBold: false,
        fontFamily:'Arial',
    });

    const bgFile = ref(null); // 사용자가 선택한 원본 이미지 파일
    const bgDataUrl = ref(null); // 미리보기, ppt 생성용 base64

    // 배경 이미지 설정(선택창에서 file 받아 처리)
    async function setBgFile(file){
        bgFile.value = file;
        bgDataUrl.value = file?await fileToBase64(file) : null;
    }

    const currentLyrics = computed(()=>{
        return lyricsSlides.value[currentSlideIdx.value];
    });

    const lyricsSlides = computed(()=> lyrics.value.trim().split(/(?:\r?\n){2,}/).map(line => line.trim()));

    watch(lyrics, (newLyrics) => {
        lyrics.value = newLyrics.replace(/(?:\r?\n){2,}/g, '\n\n');
    });

    const textBold = computed(()=>settings.isTextBold?'bold':'normal');

    function fileToBase64(file) {
        return new Promise(resolve=>{
            const reader = new FileReader();
            reader.onload = ()=>resolve(reader.result);
            reader.readAsDataURL(file);
        })
    }


    return {
        title, lyrics, currentSlideIdx, settings, currentLyrics,
        lyricsSlides,bgFile,bgDataUrl,setBgFile,textBold,
    }
});