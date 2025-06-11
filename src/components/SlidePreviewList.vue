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
const {lyricsSlides, currentSlideIdx, bgDataUrl, lyrics} = storeToRefs(lyricsStore);
// 썸네일 엘리먼트 배열을 담을 ref
const thumbEls = ref([]);

// 활성 슬라이드가 바뀔 때 자동 스크롤
/* 길이 변화 → 새 슬라이드 등장 */
watch(() => lyricsSlides.value.length, doScroll, { flush:'post' })

/* 커서 이동 등으로 인덱스만 변할 때(이미 존재하는 노드) */
watch(currentSlideIdx, doScroll, { flush:'post', immediate:false })

function doScroll() {
  nextTick(() => {
    thumbEls.value[currentSlideIdx.value]
        ?.scrollIntoView({ block:'center', behavior:'smooth' })
  })
}

</script>

<style scoped>

</style>