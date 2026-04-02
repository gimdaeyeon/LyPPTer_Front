<template>
  <div class="flex flex-wrap gap-2 px-4 py-3 h-full">
    <div class="w-full">
      <label class="text-sm font-medium">Font Size (pt)</label>
      <input type="number" class="input px-3 mt-2" v-model="fontSize" min="8" max="120" step="1"/>
    </div>
    <div class="w-full">
      <label class="text-sm font-medium">Text Color</label>
      <div class="flex gap-2 mt-2">
        <input type="color" class="color-input" v-model="textColor"/>
        <input type="text" class="text-input" v-model="textColor">
      </div>
    </div>
    <div class="w-full">
      <label class="text-sm font-medium">Text Formatting</label>
      <TextFormatter v-model="textAlign" v-model:isTextBold="isTextBold"/>
    </div>
    <FontDropdown v-model="fontFamily"/>
    <div class="w-full">
      <label class="text-sm font-medium">Line Spacing</label>
      <input type="number" class="input px-3 mt-2" v-model="lineSpacing" min="0.5" max="3.0" step="0.1"/>
    </div>
    <div class="w-full">
      <label class="text-sm font-medium">Position (inches)</label>
      <div class="flex space-x-2">
        <LabeledInput v-model="positionX" label="X" type="number" step="0.1"/>
        <LabeledInput v-model="positionY" label="Y" type="number" step="0.1"/>
      </div>
    </div>
    <div class="w-full">
      <label class="text-sm font-medium">Text Box Size (inches)</label>
      <div class="flex space-x-2">
        <LabeledInput v-model="textBoxWidth" label="W" type="number" step="0.1"/>
        <LabeledInput v-model="textBoxHeight" label="H" type="number" step="0.1"/>
      </div>
    </div>
    <BgImageUpload
        v-model:isBgImg="isBgImg"
        v-model:bgColor="bgColor"
        :bgDataUrl="bgDataUrl"
        @file-selected="lyricsStore.setBgFile"
        @file-cleared="lyricsStore.setBgFile(null)"
    />
  </div>
</template>

<script setup>
import TextFormatter from "@/components/ui/TextFormatter.vue";
import LabeledInput from "@/components/ui/LabeledInput.vue";
import FontDropdown from "@/components/ui/FontDropdown.vue";
import BgImageUpload from "@/components/ui/BgImageUpload.vue";
import {useLyrics} from "@/store/useLyrics.js";
import {toRefs} from "vue";
import {storeToRefs} from "pinia";

const lyricsStore = useLyrics();
const {bgDataUrl} = storeToRefs(lyricsStore);

const {
  fontSize, textAlign, positionX,
  positionY, textBoxWidth,
  textBoxHeight, isBgImg, bgColor, textColor,
  isTextBold, fontFamily, lineSpacing,
} = toRefs(lyricsStore.settings);
</script>
