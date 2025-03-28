<template>
  <div class="gap-1 px-6 flex flex-1 justify-center py-5">
    <div class="layout-content-container flex max-w-[1200px] flex-1">
      <SlidePreviewList/>
      <div class="overflow-hidden flex-[80_1_0]">
        <div class="h-full p-4">
          <div>
            <CustomInput class="flex h-10 w-full rounded-md border border-input border-gray-200 bg-background px-3
            py-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 disabled:cursor-not-allowed
            disabled:opacity-50 text-lg mb-4" placeholder="Enter presentation title" type="text"/>
            <div ref="canvasContainer" class="aspect-video relative overflow-hidden rounded-lg border border-gray-200">
              <canvas ref="canvas"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
    <LyricsArea/>
  </div>
</template>

<script setup>
import LyricsArea from "@/components/lyrics/LyricsEditor.vue";
import SlidePreviewList from "@/components/SlidePreviewList.vue";
import {onMounted, onUnmounted, toRefs, useTemplateRef, watch} from "vue";
import {Canvas, Textbox} from "fabric";
import CustomInput from "@/components/common/tag/CustomInput.vue";
import {useLyrics} from "@/store/useLyrics.js";
import {storeToRefs} from "pinia";
import {useFabricBinding} from "@/composables/useFabricBinding.js";

const canvasContainer = useTemplateRef('canvasContainer');
const canvas = useTemplateRef('canvas');
const lyricsStore = useLyrics();
const {lyrics, currentSlideIndex,currentLyrics, lyricsCanvas, fabricCanvas} = storeToRefs(lyricsStore);
const {
  fontSize, textAlign, textBoxWidth, textBoxHeight,
  textColor, bgColor, positionX, positionY,
} = toRefs(lyricsStore.settings);

onMounted(() => {

  const {clientWidth, clientHeight} = canvasContainer.value;

  fabricCanvas.value = new Canvas(canvas.value, {
    width: clientWidth,
    height: clientHeight,
    backgroundColor: bgColor.value
  });

  // 객체가 이동할 때마다 캔버스 경계를 벗어나지 않도록 제한
  fabricCanvas.value.on('object:moving', function (e) {
    const object = e.target;
    // 좌측, 우측 경계 검사
    if (object.left < 0) object.left = 0;
    if (object.top < 0) object.top = 0;
    if (object.left + object.width > fabricCanvas.value.width) object.left = fabricCanvas.value.width - object.width;
    if (object.top + object.height > fabricCanvas.value.height) object.top = fabricCanvas.value.height - object.height;
    // 객체가 이동할 때 좌표 업데이트
    object.setCoords();
  });

  const text = new Textbox(lyrics.value, {
    width: textBoxWidth.value,
    height: textBoxHeight.value,
    left: positionX.value,
    top: positionY.value,
    fontSize: fontSize.value,
    selectable: true, // 사용자가 클릭하여 조정 가능하도록 설정
    lockScalingX: false, // x축 크기 조절 가능
    lockScalingY: false, // y축 크기 조절 가능
    textAlign: textAlign.value,
    padding: 10,
    borderColor: '#00AB6B',
    borderDashArray: [6],
    cornerColor: '#00AB6B',
    cornerSize: 10,
    fill: textColor.value,
  });

  text.setControlVisible("mtr", false); // 회전 핸들 숨기기
  text.setControlVisible("mt", false);
  text.setControlVisible("mb", false);

  fabricCanvas.value.add(text);
  fabricCanvas.value.setActiveObject(text);

  useFabricBinding(fabricCanvas.value, text, {
    text: currentLyrics,
    fontSize: fontSize,
    textAlign: textAlign,
    width: textBoxWidth,
    height: textBoxHeight,
    fill: textColor,
    left: positionX,
    top: positionY,
  });

  watch(bgColor, (newColor) => {
    fabricCanvas.value.set('backgroundColor', newColor);
    fabricCanvas.value.renderAll();
  });

  window.addEventListener('resize', resizeCanvas);
  lyricsCanvas.value = fabricCanvas.value;


  onUnmounted(() => {
    window.removeEventListener('resize', resizeCanvas);// 컴포넌트 해제 시 이벤트 제거

  });

  function resizeCanvas() {
    if (fabricCanvas.value) {
      fabricCanvas.value.setDimensions({
        width: canvasContainer.value.clientWidth,
        height:canvasContainer.value.clientHeight,
      })
      fabricCanvas.value.renderAll()
    }
  }

});


</script>

<style scoped>

</style>