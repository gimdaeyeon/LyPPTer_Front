<template>
  <div class="overflow-hidden flex-[20_1_0]">
    <div class="h-full border-r border-gray-200">
      <div class="space-y-2 p-2 max-h-[72vh] overflow-y-scroll [&::-webkit-scrollbar]:hidden">

        <div v-for="(preview,i) in previews" class="slide-item-box"
             :class="{'border-primary':i===currentSlideIdx}"
             @click="currentSlideIdx=i"
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
const {lyricsSlides, currentSlideIdx} = storeToRefs(lyricsStore);
const {
  fontSize, textBoxWidth, textBoxHeight,
  textColor, bgColor, positionX, positionY, textAlign,
    canvasWidth,canvasHeight,
} = toRefs(lyricsStore.settings);
const img = useTemplateRef('img');

// TODO watch를 사용한 방법 고려
const previews = computed(() => {
  const images = [];

  for (const text of lyricsSlides.value) {
    const previewCanvas = new StaticCanvas(null, {
      width: canvasWidth.value,
      height: canvasHeight.value,
      backgroundColor: bgColor.value,
    });

    // TODO Preview로 보여줄시 캔버스 크기와, 가사 크기 조절 필요(작아서 잘 안보임)
    const textBox = new Textbox(text, {
      width: textBoxWidth.value,
      height: textBoxHeight.value,
      left: positionX.value,
      top: positionY.value,
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