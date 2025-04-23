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
import {getFabricImage} from "@/util/imageUtils.js";

const canvasContainer = useTemplateRef('canvasContainer');
const canvas = useTemplateRef('canvas');
const lyricsStore = useLyrics();
const {lyrics, currentLyrics, bgDataUrl} = storeToRefs(lyricsStore);
const {
  fontSize, textAlign, textBoxWidth, textBoxHeight,
  textColor, bgColor, positionX, positionY,
  canvasWidth, canvasHeight, isBgImg,
} = toRefs(lyricsStore.settings);


onMounted(() => {

  const {clientWidth, clientHeight} = canvasContainer.value;

  const fabricCanvas = new Canvas(canvas.value, {
    width: clientWidth,
    height: clientHeight,
    backgroundColor: bgColor.value
  });
  canvasWidth.value = clientWidth;
  canvasHeight.value = clientHeight;

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
    width: textBoxWidth.value,
    height: textBoxHeight.value,
    fontSize: fontSize.value,
    textAlign: textAlign.value,
    fill: textColor.value,
    padding: 10,
    borderColor: '#00AB6B',
    borderDashArray: [6],
    cornerColor: '#00AB6B',
    cornerSize: 10,
    // selectable: true, // 사용자가 클릭하여 조정 가능하도록 설정
    selectable: false,
    lockScalingX: false, // x축 크기 조절 가능
    lockScalingY: false, // y축 크기 조절 가능
    // left: positionX.value,
    // top: positionY.value,
  });

  text.setControlVisible("mtr", false); // 회전 핸들 숨기기
  text.setControlVisible("mt", false);
  text.setControlVisible("mb", false);

  positionX.value =fabricCanvas.getWidth()/2;
  positionY.value = fabricCanvas.getHeight()*0.2;

  text.setPositionByOrigin(
      {x: positionX.value,y:positionY.value},
'center',
'center'
  );
  text.setCoords(); // 위치 업데이트

  fabricCanvas.add(text);
  fabricCanvas.setActiveObject(text);

  useFabricBinding(fabricCanvas, text, {
    text: currentLyrics,
    fontSize: fontSize,
    textAlign: textAlign,
    width: textBoxWidth,
    height: textBoxHeight,
    fill: textColor,
  });

  watch([positionX,positionY],([x,y])=>{
    text.setPositionByOrigin(
        {x,y},
        'center',
        'center'
    );
    text.setCoords();
    fabricCanvas.requestRenderAll();
  });

  watch(bgColor, (newColor) => {
    fabricCanvas.set('backgroundColor', newColor);
    fabricCanvas.renderAll();
  });

  watch(isBgImg, async (newValue) => {
    let img = null;

    if(newValue && bgDataUrl.value){
      img = await getFabricImage(bgDataUrl.value,fabricCanvas.getWidth(),fabricCanvas.getHeight());
    }
    fabricCanvas.set('backgroundImage', img);
    fabricCanvas.requestRenderAll();
  });

  watch(bgDataUrl, async (newImg) => {
    if (!isBgImg.value || !newImg) {
      fabricCanvas.set('backgroundImage', null);
      fabricCanvas.requestRenderAll();
      return;
    }

    const img = await getFabricImage(newImg,fabricCanvas.getWidth(),fabricCanvas.getHeight());

    fabricCanvas.set('backgroundImage', img);
    fabricCanvas.requestRenderAll();

  });

  window.addEventListener('resize', resizeCanvas);

  onUnmounted(() => {
    window.removeEventListener('resize', resizeCanvas);// 컴포넌트 해제 시 이벤트 제거
  });

  function resizeCanvas() {
    const width = canvasContainer.value.clientWidth;
    const height = canvasContainer.value.clientHeight;

    if (fabricCanvas) {
      fabricCanvas.setDimensions({width, height});
      canvasWidth.value = width;
      canvasHeight.value = height;

      const bgImg = fabricCanvas.backgroundImage;

      if (bgImg) {
        const imgWidth = bgImg.width;
        const imgHeight = bgImg.height;

        // cover 스타일로 비율 계산
        const scaleX = width / imgWidth;
        const scaleY = height / imgHeight;
        const scale = Math.max(scaleX, scaleY); // 빈 공간 없이 꽉 채움

        bgImg.scale(scale);
        bgImg.set({
          left: (width - bgImg.getScaledWidth()) / 2,
          top: (height - bgImg.getScaledHeight()) / 2,
        });
      }

      const textBox = fabricCanvas.getObjects().find(obj=>obj instanceof Textbox);
      if(textBox){
        positionX.value = width/2;
        positionY.value = height*0.2;
        textBox.setPositionByOrigin(
            {x:width/2,y:height*0.2},
            'center',
            'center'
        );
        textBox.setCoords();
      }

      fabricCanvas.renderAll();
    }
  }
});


</script>

<style scoped>

</style>