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
import {ref, toRefs, watch} from 'vue';
import {useLyrics} from '@/store/useLyrics.js';
import {storeToRefs} from 'pinia';
import {FabricImage, StaticCanvas, Textbox} from 'fabric';
import {loadImageElement} from "@/util/imageUtils.js";

const lyricsStore = useLyrics();
const {lyricsSlides, currentSlideIdx, bgDataUrl} = storeToRefs(lyricsStore);
const {
  fontSize, textBoxWidth, textBoxHeight,
  textColor, bgColor, positionX, positionY, textAlign,
  canvasWidth, canvasHeight,isBgImg,
} = toRefs(lyricsStore.settings);

const previews = ref([]); // ✅ 이미지 목록

watch([
  lyricsSlides, bgDataUrl,
  fontSize, textBoxWidth, textBoxHeight,
  textColor, bgColor, positionX, positionY, textAlign,
  canvasWidth, canvasHeight,isBgImg,
], generatePreviews,);

let cachedImageElement = null; //HTMLImageElement
let cachedImageUrl = null;

async function generatePreviews() {
  previews.value = []; // 초기화

  // 배경 이미지 로딩은 1회만 실행
  if (bgDataUrl.value && bgDataUrl.value !== cachedImageUrl) {
    cachedImageElement = await loadImageElement(bgDataUrl.value);
    cachedImageUrl = bgDataUrl.value;
  }

  for (const text of lyricsSlides.value) {
    const canvas = new StaticCanvas(null, {
      width: canvasWidth.value,
      height: canvasHeight.value,
      backgroundColor: bgColor.value,
    });

    // FabricImage를 슬라이드별로 새로 생성
    if (isBgImg.value && bgDataUrl.value && cachedImageElement) {
      const img = new FabricImage(cachedImageElement);
      const scale = Math.max(
          canvasWidth.value / img.width,
          canvasHeight.value / img.height
      );

      img.scale(scale);
      img.set({
        left: (canvasWidth.value - img.getScaledWidth()) / 2,
        top: (canvasHeight.value - img.getScaledHeight()) / 2,
        originX: 'left',
        originY: 'top'
      });

      canvas.set('backgroundImage', img);
    }

    // ✅ 가사 텍스트 박스 추가
    const textBox = new Textbox(text, {
      width: textBoxWidth.value,
      height: textBoxHeight.value,
      left: positionX.value,
      top: positionY.value,
      fontSize: fontSize.value,
      fill: textColor.value,
      textAlign: textAlign.value,
    });

    textBox.setPositionByOrigin(
        {x:canvas.getWidth()/2,y:canvas.getHeight()*0.2},
        'center',
        'center'
    );

    textBox.setCoords();

    canvas.add(textBox);
    canvas.renderAll();

    // ✅ 미리보기 이미지 추가
    previews.value.push(canvas.toDataURL({multiplier:0.25}));
  }
}

// 이미지 요소 직접 생성


</script>

<style scoped>

</style>