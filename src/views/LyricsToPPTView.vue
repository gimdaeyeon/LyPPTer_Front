<template>
  <div class="flex flex-1 flex-col px-3 sm:px-4 lg:px-6 py-3 lg:py-5 overflow-hidden">

    <!-- Tablet horizontal slide strip (640px ~ 1023px) -->
    <SlidePreviewList v-if="isTablet" :horizontal="true"/>

    <!-- Main content area -->
    <div class="flex flex-col sm:flex-row flex-1 w-full mx-auto gap-1 overflow-hidden">

      <!-- Desktop left sidebar (>= 1024px) -->
      <SlidePreviewList v-if="isDesktop"/>

      <!-- Slide preview area -->
      <div class="overflow-hidden flex-shrink-0 sm:flex-shrink sm:flex-1 lg:flex-[80_1_0]">
        <div class="h-full p-2 sm:p-4">
          <CustomInput
              class="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3
              py-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 disabled:cursor-not-allowed
              disabled:opacity-50 text-base sm:text-lg mb-2 sm:mb-4 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              v-model="title"
              placeholder="Enter presentation title"
              type="text"
          />
          <div class="aspect-video relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <SlidePreview
                :lyrics="currentLyrics"
                :settings="lyricsStore.settings"
                :bgDataUrl="bgDataUrl"
                :interactive="!isMobile"
                @update:positionX="v => lyricsStore.settings.positionX = v"
                @update:positionY="v => lyricsStore.settings.positionY = v"
                @update:textBoxWidth="v => lyricsStore.settings.textBoxWidth = v"
                @update:textBoxHeight="v => lyricsStore.settings.textBoxHeight = v"
                @update:lyrics="v => lyricsStore.updateSlideText(lyricsStore.currentSlideIdx, v)"
                @snapshot="lyricsStore.snapshotNow()"
            />
          </div>
        </div>
      </div>

      <!-- Mobile horizontal slide strip -->
      <SlidePreviewList v-if="isMobile" :horizontal="true"/>

      <!-- Lyrics editor panel -->
      <div class="w-full sm:w-[320px] lg:w-[360px] sm:flex-shrink-0 flex-1 sm:flex-initial overflow-y-auto">
        <LyricsArea/>
      </div>
    </div>
  </div>
</template>

<script setup>
import LyricsArea from "@/components/lyrics/LyricsEditor.vue";
import SlidePreviewList from "@/components/SlidePreviewList.vue";
import SlidePreview from "@/components/SlidePreview.vue";
import CustomInput from "@/components/common/tag/CustomInput.vue";
import {useLyrics} from "@/store/useLyrics.js";
import {storeToRefs} from "pinia";
import {useKeyboardShortcuts} from "@/composables/useKeyboardShortcuts.js";
import {useBreakpoint} from "@/composables/useBreakpoint.js";

const lyricsStore = useLyrics();
const {currentLyrics, bgDataUrl, title} = storeToRefs(lyricsStore);

const {isMobile, isTablet, isDesktop} = useBreakpoint();

useKeyboardShortcuts();
</script>
