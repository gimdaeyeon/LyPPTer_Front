<template>
  <div class="flex max-w-[480px] flex-wrap gap-4 px-4 py-3 h-full">
    <label  class="flex flex-col min-w-40 flex-1 h-full">
        <TextArea ref="textarea" @keyup="setCurrentSlide" @click="setCurrentSlide"
            placeholder="Type or paste lyrics here..."
            class="text-area form-input flex w-full min-w-0 flex-1 resize-none overflow-y-scroll rounded-xl focus:outline-0 border
            border-gray-200 h-full min-h-36 placeholder:text-[#B88746] p-[15px] text-base font-normal leading-normal"
            v-model="lyrics"
        />
    </label>
  </div>
</template>

<script setup>

import TextArea from "@/components/common/tag/TextArea.vue";

import {useLyrics} from "@/store/useLyrics.js";
import {storeToRefs} from "pinia";
import {useTemplateRef, watch} from "vue";
const lyricsStore = useLyrics();
const {lyrics,lyricsSlides, currentSlideIdx} = storeToRefs(lyricsStore);
const textarea = useTemplateRef('textarea');

// 가사 입력창에서 입력 커서의 이동에 따라 현재 슬라이드 번호를 변경하는 함수
function setCurrentSlide(){
  const cursorPos = textarea.value.textarea.selectionStart;
  let offset= 0;

  for(let i = 0; i<lyricsSlides.value.length; i++){
    const slide = lyricsSlides.value[i];
    const end = offset + slide.length;

    if(cursorPos <= end){
      currentSlideIdx.value = i;
      return;
    }
    // 슬라이드 간 줄바꿈 2개 길이 반영
    offset = end +2;
  }
}



</script>

<style scoped>
.text-area::-webkit-scrollbar{
  //border-radius: 12px;
  display: none;
}
</style>