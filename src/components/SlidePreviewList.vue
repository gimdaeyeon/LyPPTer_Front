<template>
  <div class="overflow-hidden flex-[20_1_0]">
    <div class="h-full border-r border-gray-200">
      <div class="space-y-2 p-2 max-h-[72vh] overflow-y-scroll [&::-webkit-scrollbar]:hidden">
        <SlideThumb v-for="(slide, i ) in lyricsSlides"
                    :key="i"
                    :index="i"
                    :lyrics="slide"
                    :settings="lyricsStore.settings"
                    :bg-data-url="bgDataUrl"
                    :active="i===currentSlideIdx"
                    @click="currentSlideIdx=i"
                    :ref="el => (thumbEls[i] = el?.$el ?? el)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import {useLyrics} from '@/store/useLyrics.js';
import {storeToRefs} from 'pinia';
import SlideThumb from "@/components/SlideThumb.vue";
import {nextTick, ref, watch} from "vue";

const lyricsStore = useLyrics();
const {lyricsSlides, currentSlideIdx, bgDataUrl} = storeToRefs(lyricsStore);
// 썸네일 엘리먼트 배열을 담을 ref
const thumbEls = ref([]);


// 활성 슬라이드가 바뀔 때 자동 스크롤
watch(currentSlideIdx, idx => {
  nextTick(() => {
    const el = thumbEls.value[idx];
    if (el) {
      el.scrollIntoView({
        block: 'center', // 가운데 정렬 (start/end)
        behavior: 'smooth'
      })
    }
  })
});


</script>

<style scoped>

</style>