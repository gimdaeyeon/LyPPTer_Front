<template>
  <div class="overflow-hidden flex-[20_1_0]">
    <div class="h-full border-r border-gray-200">
      <div class="space-y-2 p-2 max-h-[72vh] overflow-y-scroll [&::-webkit-scrollbar]:hidden">

        <!--        <div v-for="(slide,i) in lyricsSlides" class="slide-item-box"-->
        <!--             :class="{'border-primary':i===currentSlideIndex}"-->
        <!--             @click="currentSlideIndex=i"-->
        <!--        >-->
        <!--          <img :src="preview" class="absolute h-full w-full" :alt="`Slide ${i+1}`">-->
        <!--          <div class="slide-number">{{i+1}}</div>-->
        <!--        </div>-->
        <div v-for="(preview,i) in previews" class="slide-item-box"
             :class="{'border-primary':i===currentSlideIndex}"
             @click="currentSlideIndex=i"
        >
          <img :src="preview" class="absolute h-full w-full" :alt="`Slide ${i+1}`">
          <div class="slide-number">{{ i + 1 }}</div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import {useLyrics} from "@/store/useLyrics.js";
import {storeToRefs} from "pinia";
import {computed, toRefs, useTemplateRef} from "vue";
import {StaticCanvas, Textbox} from "fabric";

const lyricsStore = useLyrics();
const {fabricCanvas, lyricsSlides, currentSlideIndex} = storeToRefs(lyricsStore);
const {
  fontSize, textBoxWidth, textBoxHeight,
  textColor, bgColor, positionX, positionY, textAlign
} = toRefs(lyricsStore.settings);
const img = useTemplateRef('img');


// TODO watch를 사용한 방법 고려
const previews = computed(() => {
  const images = [];

  for (const text of lyricsSlides.value) {
    const previewCanvas = new StaticCanvas(null, {
      width: 320,
      height: 180,
      backgroundColor: bgColor.value,
    });

    const textBox = new Textbox(text, {
      width: 280, // 캔버스보다 약간 작은 크기
      height: 100,
      left: 20,
      top: 40,
      fontSize: fontSize.value,
      fill:textColor.value,
      textAlign: textAlign.value,
    });

    previewCanvas.add(textBox);
    previewCanvas.renderAll();

    images.push(previewCanvas.toDataURL());
  }
  return images;
});


</script>

<style scoped>

</style>