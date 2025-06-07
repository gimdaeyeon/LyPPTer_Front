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
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import {useLyrics} from '@/store/useLyrics.js';
import {storeToRefs} from 'pinia';
import SlideThumb from "@/components/SlideThumb.vue";

const lyricsStore = useLyrics();
const {lyricsSlides, currentSlideIdx, bgDataUrl} = storeToRefs(lyricsStore);



</script>

<style scoped>

</style>