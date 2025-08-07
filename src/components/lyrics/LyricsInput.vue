<template>
  <div class="flex max-w-[480px] flex-wrap gap-4 px-4 py-3 h-full">
    <label  class="flex flex-col min-w-40 flex-1 h-full">
        <TextArea ref="textarea" @keyup="setCurrentSlide" @click="setCurrentSlide"
            placeholder="Type or paste lyrics here..."
            class="text-area form-input flex w-full min-w-0 flex-1 resize-none overflow-y-scroll rounded-xl focus:outline-0 border
            border-gray-200 h-full min-h-36 placeholder:text-secondary p-[15px] text-base font-normal leading-normal"
            v-model="localLyrics"
        />
    </label>
  </div>
</template>

<script setup>

import TextArea from "@/components/common/tag/TextArea.vue";

import {useLyrics} from "@/store/useLyrics.js";
import {storeToRefs} from "pinia";
import {nextTick, onMounted, ref, useTemplateRef, watch} from "vue";

const lyricsStore = useLyrics();
const {lyrics, currentSlideIdx} = storeToRefs(lyricsStore);
const textarea = useTemplateRef('textarea');
const localLyrics = ref('');

// 가사 입력창에서 입력 커서의 이동에 따라 현재 슬라이드 번호를 변경하는 함수
async function setCurrentSlide(){
  if (!textarea.value) return
  const pos = textarea.value.textarea.selectionStart
  /* 커서 앞 문자열 */
  const before = localLyrics.value.slice(0, pos)
  /* 구분자(엔터 2줄↑)로 split → 배열 길이 - 1 == 슬라이드 인덱스 */
  currentSlideIdx.value = before.split(/(?:\r?\n){2,}/).length -1;
}

onMounted(()=>{
  localLyrics.value = lyrics.value;
});

watch(localLyrics,(newLyrics)=>{
  lyrics.value = newLyrics;
});

</script>

<style scoped>
.text-area::-webkit-scrollbar{
  //border-radius: 12px;
  display: none;
}
</style>