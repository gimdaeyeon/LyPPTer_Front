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
              <!--              <img class="absolute h-full w-full"-->
              <!--                   alt="Mountain Landscape" loading="lazy" decoding="async" data-nimg="fill"-->
              <!--                   src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&amp;auto=format&amp;fit=crop&amp;q=60&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW91bnRhaW5zfGVufDB8fDB8fHww">-->
              <!--              <div class="absolute w-[200] h-[100] border-2 border-dashed border-primary cursor-move overflow-hidden"-->
              <!--                   style="left: 44.0601%; top: 7.76009%;">-->
              <!--                <textarea class="w-full h-full resize-none border-none text-white text-base p-1"-->
              <!--                >Enter your text here</textarea>-->
              <!--                <div class="absolute size-[10px] bg-primary cursor-se-resize"-->
              <!--                     style="right: -5px; bottom: -5px;">-->

              <!--                </div>-->
              <!--              </div>-->
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
import {onMounted, ref, watch} from "vue";
import {Canvas, Textbox} from "fabric";
import CustomInput from "@/components/common/tag/CustomInput.vue";
import TextArea from "@/components/common/tag/TextArea.vue";
import {useLyrics} from "@/store/useLyrics.js";
import {storeToRefs} from "pinia";

const canvasContainer = ref();
const canvas = ref();
const lyricsStore = useLyrics();
const {lyrics} = storeToRefs(lyricsStore);
let fabricCanvas;


onMounted(() => {
  const {clientWidth, clientHeight} = canvasContainer.value;

  fabricCanvas = new Canvas(canvas.value, {
    width: clientWidth,
    height: clientHeight,
    // selection: true
  });

  // 객체가 이동할 때마다 캔버스 경계를 벗어나지 않도록 제한
  fabricCanvas.on('object:moving', function (e) {
    const object = e.target;
    // 좌측, 우측 경계 검사
    if (object.left < 0) object.left = 0;
    if (object.top < 0) object.top = 0;
    if (object.left + object.width > fabricCanvas.width) object.left = fabricCanvas.width - object.width;
    if (object.top + object.height > fabricCanvas.height) object.top = fabricCanvas.height - object.height;
    // 객체가 이동할 때 좌표 업데이트
    object.setCoords();
  });


  const text = new Textbox(lyrics.value, {
    width: 400,
    left: 175,
    top: 70,
    fontSize: 30,
    selectable: true, // 사용자가 클릭하여 조정 가능하도록 설정
    lockScalingX: false, // x축 크기 조절 가능
    lockScalingY: false, // y축 크기 조절 가능
    textAlign: 'center',
    padding: 10
  });

  fabricCanvas.add(text);
  fabricCanvas.setActiveObject(text);

  watch(lyrics, (newLyrics) => {
    text.set('text', newLyrics);
    fabricCanvas.renderAll();
  });

});


</script>

<style scoped>

</style>