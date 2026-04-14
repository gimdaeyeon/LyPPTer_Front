<template>
  <div class="flex flex-col px-4 py-3">
    <label class="flex flex-col min-w-40">
        <TextArea ref="textarea" @keyup="setCurrentSlide" @click="setCurrentSlide"
                  placeholder="Type or paste lyrics here..."
                  class="text-area form-input flex w-full min-w-0 resize-none overflow-y-scroll rounded-xl focus:outline-0 border
            border-gray-200 placeholder:text-secondary p-[15px] text-base leading-normal"
                  :style="{ height: textareaHeight + 'px' }"
                  v-model="localLyrics"
        />
        <div class="cursor-row-resize flex items-center justify-center py-1.5 group"
             @mousedown.prevent="startResize"
             @touchstart.prevent="startResize">
          <div class="w-10 h-1 rounded-full bg-gray-300 group-hover:bg-gray-400 transition-colors"></div>
        </div>
    </label>
  </div>
</template>

<script setup>

import TextArea from "@/components/common/tag/TextArea.vue";

import {useLyrics} from "@/store/useLyrics.js";
import {normalizeNewlines} from "@/utils/lyricsUtils.js";
import {storeToRefs} from "pinia";
import {onMounted, ref, useTemplateRef, watch} from "vue";

const STORAGE_KEY = 'lyricsTextareaHeight';
const MIN_HEIGHT = 200;
const MAX_HEIGHT = 2000;
const DEFAULT_HEIGHT = 500;

const textareaHeight = ref(
  Number(localStorage.getItem(STORAGE_KEY)) || DEFAULT_HEIGHT
);

watch(textareaHeight, (h) => {
  localStorage.setItem(STORAGE_KEY, String(h));
});

function startResize(e) {
  const startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
  const startHeight = textareaHeight.value;

  function onMove(moveEvent) {
    const currentY = moveEvent.type === 'touchmove' ? moveEvent.touches[0].clientY : moveEvent.clientY;
    const newHeight = startHeight + (currentY - startY);
    textareaHeight.value = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, newHeight));
  }

  function onUp() {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onUp);
  }

  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
  document.addEventListener('touchmove', onMove);
  document.addEventListener('touchend', onUp);
}

const lyricsStore = useLyrics();
const {lyrics, currentSlideIdx} = storeToRefs(lyricsStore);
const textarea = useTemplateRef('textarea');
// pinia 상태 직접연결시 컴포넌트 재렌더링에의해 키보드 커서가 초기화되는 현상 발생
// 해당 변수를 둠으로써 커서위치 값에 영향이 가지 않도록 처리
const localLyrics = ref('');
let isSyncingFromStore = false; // 외부 동기화 시 normalizeNewlines 재적용 방지 플래그

// 가사 입력창에서 입력 커서의 이동에 따라 현재 슬라이드 번호를 변경하는 함수
async function setCurrentSlide() {
  if (!textarea.value) return
  const pos = textarea.value.textarea.selectionStart
  const before = localLyrics.value.slice(0, pos)
  currentSlideIdx.value = before.split(/(?:\r?\n){2,}/).length - 1;
}

onMounted(() => {
  localLyrics.value = lyrics.value;
});

watch(localLyrics, (newLyrics) => {
  if (isSyncingFromStore) return;
  lyrics.value = normalizeNewlines(newLyrics);
}, { flush: 'sync' });

// 외부에서 lyrics가 변경된 경우 (SlidePreview 인라인 편집 등)
// IME 조합 중에는 localLyrics를 덮어쓰지 않음 (한글 입력 끊김 방지)
watch(lyrics, (newLyrics) => {
  if (newLyrics !== localLyrics.value && !textarea.value?.composing) {
    isSyncingFromStore = true;
    localLyrics.value = newLyrics;
    isSyncingFromStore = false;
  }
});

</script>

<style scoped>
</style>
