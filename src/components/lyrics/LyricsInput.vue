<template>
  <div class="flex max-w-[480px] flex-wrap gap-4 px-4 py-3 h-full">
    <label  class="flex flex-col min-w-40 flex-1 h-full">
        <TextArea ref="textarea"
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
const {lyrics} = storeToRefs(lyricsStore);
const textarea = useTemplateRef('textarea');

watch(lyrics,(text)=>{
  console.log(text.length);
  console.log(textarea.value.textarea.selectionStart);
  console.log(textarea.value.textarea.selectionEnd);
})

</script>

<style scoped>
.text-area::-webkit-scrollbar{
  //border-radius: 12px;
  display: none;
}
</style>