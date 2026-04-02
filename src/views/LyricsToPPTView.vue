<template>
  <div class="gap-1 px-6 flex flex-1 justify-center py-5">
    <div class="layout-content-container flex max-w-[1200px] flex-1">
      <SlidePreviewList/>
      <div class="overflow-hidden flex-[80_1_0]">
        <div class="h-full p-4">
          <div>
            <CustomInput class="flex h-10 w-full rounded-md border border-input border-gray-200 bg-background px-3
            py-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 disabled:cursor-not-allowed
            disabled:opacity-50 text-lg mb-4" v-model="title" placeholder="Enter presentation title" type="text"/>
            <div class="aspect-video relative overflow-hidden rounded-lg border border-gray-200">
              <SlidePreview
                  :lyrics="currentLyrics"
                  :settings="lyricsStore.settings"
                  :bgDataUrl="bgDataUrl"
                  :interactive="true"
                  @update:positionX="v => lyricsStore.settings.positionX = v"
                  @update:positionY="v => lyricsStore.settings.positionY = v"
                  @update:textBoxWidth="v => lyricsStore.settings.textBoxWidth = v"
                  @update:textBoxHeight="v => lyricsStore.settings.textBoxHeight = v"
                  @update:lyrics="v => lyricsStore.updateSlideText(lyricsStore.currentSlideIdx, v)"
              />
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
import SlidePreview from "@/components/SlidePreview.vue";
import CustomInput from "@/components/common/tag/CustomInput.vue";
import {useLyrics} from "@/store/useLyrics.js";
import {storeToRefs} from "pinia";

const lyricsStore = useLyrics();
const {currentLyrics, bgDataUrl, title} = storeToRefs(lyricsStore);
</script>

<style scoped>

</style>
