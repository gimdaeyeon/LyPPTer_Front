import {defineStore} from "pinia";
import {computed, reactive, ref, watch} from "vue";
import {makeThumbDataUrl} from "@/utils/imageUtils.js";
import {splitSlides} from "@/utils/lyricsUtils.js";
import {useHistory} from "@/composables/useHistory.js";
import {
    DEFAULT_FONT_SIZE_PT, DEFAULT_POSITION_X, DEFAULT_POSITION_Y,
    DEFAULT_TEXT_BOX_WIDTH, DEFAULT_TEXT_BOX_HEIGHT, DEFAULT_LINE_SPACING,
} from "@/utils/constants.js";

/* ---------- localStorage 지속성 ---------------------------------------- */
const STORAGE_KEY = 'lyppter_v1'

function loadFromStorage() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
    } catch {
        return null
    }
}

let saveTimer = null
function debouncedSave(data) {
    clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }, 500)
}

/* ---------------------------------------------------------------------- */
export const useLyrics = defineStore('lyrics', () => {
    const saved = loadFromStorage()

    const currentSlideIdx = ref(0);
    const lyrics = ref(saved?.lyrics ?? '가사를 입력하세요');
    const title = ref(saved?.title ?? '')

    // 슬라이드 옵션 (PPT 네이티브 단위: fontSize=pt, 위치/크기=inches)
    const settings = reactive({
        fontSize: saved?.settings?.fontSize ?? DEFAULT_FONT_SIZE_PT,
        textColor: saved?.settings?.textColor ?? '#FFFFFF',
        textAlign: saved?.settings?.textAlign ?? 'center',
        positionX: saved?.settings?.positionX ?? DEFAULT_POSITION_X,
        positionY: saved?.settings?.positionY ?? DEFAULT_POSITION_Y,
        textBoxWidth: saved?.settings?.textBoxWidth ?? DEFAULT_TEXT_BOX_WIDTH,
        textBoxHeight: saved?.settings?.textBoxHeight ?? DEFAULT_TEXT_BOX_HEIGHT,
        isBgImg: false, // 이미지는 직렬화 불가 → 저장 안 함
        bgColor: saved?.settings?.bgColor ?? '#000000',
        isTextBold: saved?.settings?.isTextBold ?? true,
        fontFamily: saved?.settings?.fontFamily ?? 'Arial',
        lineSpacing: saved?.settings?.lineSpacing ?? DEFAULT_LINE_SPACING,
    });

    const bgFile = ref(null); // 사용자가 선택한 원본 이미지 파일
    const bgDataUrl = ref(null); // 미리보기, ppt 생성용 base64
    const thumbBgDataUrl = ref(null); // 썸네일용 압축 base64

    // 배경 이미지 설정(선택창에서 file 받아 처리)
    async function setBgFile(file) {
        bgFile.value = file;
        bgDataUrl.value = file ? await fileToBase64(file) : null;
        thumbBgDataUrl.value = file ? await makeThumbDataUrl(bgDataUrl.value) : null;
    }

    const currentLyrics = computed(() => {
        return lyricsSlides.value[currentSlideIdx.value];
    });

    const lyricsSlides = computed(() =>
        splitSlides(lyrics.value).map(line => line.trim())
    );

    const textBold = computed(() => settings.isTextBold ? 'bold' : 'normal');

    function updateSlideText(index, newText) {
        const slides = splitSlides(lyrics.value);
        if (index >= 0 && index < slides.length) {
            slides[index] = newText;
            lyrics.value = slides.join('\n\n');
        }
    }

    /* ---------- 슬라이드 관리 --------------------------------------------- */
    function deleteSlide(index) {
        const slides = splitSlides(lyrics.value);
        if (slides.length <= 1) return // 최소 1개 슬라이드 유지
        slides.splice(index, 1)
        lyrics.value = slides.join('\n\n')
        if (currentSlideIdx.value >= slides.length) {
            currentSlideIdx.value = slides.length - 1
        }
    }

    function duplicateSlide(index) {
        const slides = splitSlides(lyrics.value);
        if (index >= 0 && index < slides.length) {
            slides.splice(index + 1, 0, slides[index])
            lyrics.value = slides.join('\n\n')
            currentSlideIdx.value = index + 1
        }
    }

    function moveSlide(fromIndex, toIndex) {
        const slides = splitSlides(lyrics.value);
        if (fromIndex < 0 || fromIndex >= slides.length) return
        if (toIndex < 0 || toIndex >= slides.length) return
        if (fromIndex === toIndex) return
        const [moved] = slides.splice(fromIndex, 1)
        slides.splice(toIndex, 0, moved)
        lyrics.value = slides.join('\n\n')
        currentSlideIdx.value = toIndex
    }

    /* ---------- Undo/Redo ------------------------------------------------ */
    const history = useHistory(
        () => ({lyrics: lyrics.value, title: title.value, settings: {...settings}}),
        (state) => {
            lyrics.value = state.lyrics
            title.value = state.title
            Object.assign(settings, state.settings)
        }
    )

    // settings/lyrics/title 변경 시 자동 스냅샷 (debounced)
    let historyTimer = null
    watch(
        [lyrics, title, () => ({...settings})],
        () => {
            if (history.isRestoring()) return
            clearTimeout(historyTimer)
            historyTimer = setTimeout(() => history.pushState(), 400)
        },
        {deep: true}
    )

    /** 드래그/리사이즈 시작 전 즉시 스냅샷 (debounce 무시) */
    function snapshotNow() {
        clearTimeout(historyTimer)
        history.pushState()
    }

    /* -------------------------------------------------------------------- */

    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('파일 읽기 실패'));
            reader.readAsDataURL(file);
        })
    }

    // 상태 변경 시 localStorage에 자동 저장 (500ms debounce)
    // bgDataUrl은 용량이 크므로 저장 제외
    watch(
        [lyrics, title, () => ({...settings})],
        () => {
            debouncedSave({
                lyrics: lyrics.value,
                title: title.value,
                settings: {...settings},
            })
        },
        {deep: true}
    )

    return {
        title, lyrics, currentSlideIdx, settings, currentLyrics,
        lyricsSlides, bgFile, bgDataUrl, setBgFile, textBold, thumbBgDataUrl,
        updateSlideText, deleteSlide, duplicateSlide, moveSlide,
        undo: history.undo, redo: history.redo,
        canUndo: history.canUndo, canRedo: history.canRedo,
        snapshotNow,
    }
});
