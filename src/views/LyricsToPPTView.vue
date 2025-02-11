<template>
  <div class="gap-1 px-6 flex flex-1 justify-center py-5">
    <div class="layout-content-container flex max-w-[1200px] flex-1">
      <SlidePreviewList/>
      <div class="overflow-hidden flex-[80_1_0]">
        <div class="h-full p-4">
          <div>
            <input class="flex h-10 w-full rounded-md border border-input border-gray-200 bg-background px-3
            py-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 disabled:cursor-not-allowed
            disabled:opacity-50 text-lg mb-4" placeholder="Enter presentation title" type="text">
            <div class="aspect-video relative overflow-hidden rounded-lg border border-gray-200">
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
import LyricsArea from "@/components/LyricsArea.vue";
import SlidePreviewList from "@/components/SlidePreviewList.vue";
import {onMounted, ref} from "vue";
import {Canvas, Text} from "fabric";

const canvas = ref();

onMounted(()=>{

  canvas.value = new Canvas(canvas.value);

  const text = new Text("가사 미리보기", {
    left: 100,
    top: 100,
    fontSize: 30,
    fill: "black",
    selectable: true, // 사용자가 클릭하여 조정 가능하도록 설정
  });
  canvas.value.add(text);
});

</script>

<style scoped>

</style>