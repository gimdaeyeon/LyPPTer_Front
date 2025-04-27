<template>
  <div class="flex flex-wrap gap-2 px-4 py-3 h-full">
    <div class="w-full">
      <label class="text-sm font-medium">Font Size</label>
      <input type="number" class="input px-3 mt-2" v-model="fontSize"/>
    </div>
    <div class="w-full">
      <label class="text-sm font-medium">Text Color</label>
      <div class="flex gap-2 mt-2">
        <input type="color" class="color-input" v-model="textColor"/>
        <input type="text" class="text-input" v-model="textColor">
      </div>
    </div>
    <div class="w-full">
      <label class="text-sm font-medium">Text Alignment</label>
      <TextAlignSelector v-model="textAlign"/>
    </div>
    <div class="w-full">
      <label class="text-sm font-medium">Position</label>
      <div class="flex space-x-2">
        <LabeledInput v-model="positionX" label="X" type="number"/>
        <LabeledInput v-model="positionY" label="Y" type="number"/>
      </div>
    </div>
    <div class="w-full">
      <label class="text-sm font-medium">Text Box Size</label>
      <div class="flex space-x-2">
        <LabeledInput v-model="textBoxWidth" label="Width" type="number"/>
        <LabeledInput v-model="textBoxHeight" label="Height" type="number"/>
      </div>
    </div>
    <div class="w-full">
      <div class="flex justify-between items-center">
        <label class="text-sm font-medium">Background</label>
        <div>
          <button class="icon-btn" :class="{selected:!isBgImg}" @click="isBgImg=false">
            <font-awesome-icon :icon="['fas', 'palette']" />
          </button>
          <button class="icon-btn" :class="{selected:isBgImg}" @click="isBgImg=true">
            <font-awesome-icon :icon="['far', 'image']" />
          </button>
        </div>
      </div>
      <div class="flex gap-2 mt-2">
        <template v-if="isBgImg">
          <input id="bg-img" class="hidden" type="file" accept="image/*" @change="onImageSelected"
                 ref="fileRef"
          >
          <label for="bg-img"
                 class="input justify-center items-center gap-2 cursor-pointer
                 hover:bg-gray-100 font-semibold px-4">
            <font-awesome-icon :icon="['fas', 'upload']" />
            <span class="truncate">{{fileName}}</span>
          </label>
          <button v-if="bgDataUrl" @click="clearImage" class="icon-btn text-sm">
            <font-awesome-icon :icon="['fas', 'x']" />
          </button>
        </template>
        <template v-else>
          <input type="color" class="color-input" v-model="bgColor"/>
          <input type="text" class="text-input" v-model="bgColor">
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>

import TextAlignSelector from "@/components/ui/TextAlignSelector.vue";
import LabeledInput from "@/components/ui/LabeledInput.vue";
import {useLyrics} from "@/store/useLyrics.js";
import {ref, toRefs, useTemplateRef} from "vue";
import {storeToRefs} from "pinia";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const lyricsStore = useLyrics();
const fileName = ref('Choose image');
const fileRef = useTemplateRef('fileRef');
const {bgDataUrl} = storeToRefs(lyricsStore);

const {fontSize, textAlign, positionX,
  positionY, textBoxWidth,
  textBoxHeight, isBgImg, bgColor, textColor,} = toRefs(lyricsStore.settings);

function onImageSelected(e){
  const file = e.target.files?.[0];
  if(!file) return;
  fileName.value = file.name;
  lyricsStore.setBgFile(file);
}

function clearImage(){
  fileName.value = 'Choose image';
  fileRef.value.value = '';
  lyricsStore.setBgFile(null);
}

</script>

<style scoped>
.selected {
  background-color: #E5F6F0;
}

.selected > svg {
  color: var(--color-primary);
}
</style>