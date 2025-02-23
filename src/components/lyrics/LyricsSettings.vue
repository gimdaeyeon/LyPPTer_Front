<template>
  <div class="flex flex-wrap gap-2 px-4 py-3 h-full">
    <div class="w-full">
      <label class="text-sm font-medium">Font Size</label>
      <input type="number" class="input px-3 mt-2" v-model="fontSize"/>
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
            <i class="fa-solid fa-palette"></i>
          </button>
          <button class="icon-btn" :class="{selected:isBgImg}" @click="isBgImg=true">
            <i class="fa-regular fa-image"></i>
          </button>
        </div>
      </div>
      <div class="flex gap-2 mt-2">
        <template v-if="isBgImg">
          <input id="bg-img" class="hidden" type="file" accept="image/*">
          <label for="bg-img" class="input justify-center items-center gap-2 cursor-pointer hover:bg-gray-100 font-semibold">
            <i class="fa-solid fa-upload"></i>
            Choose image
          </label>
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
import {ref} from "vue";
import LabeledInput from "@/components/ui/LabeledInput.vue";

const fontSize = ref(24);
const textAlign = ref('left');
const positionX = ref(30);
const positionY = ref(50);
const textBoxWidth = ref(200);
const textBoxHeight = ref(200);
const isBgImg = ref(true);
const bgColor= ref('#000000');


</script>

<style scoped>
.selected {
  background-color: #E5F6F0;
}

.selected > i {
  color: #00AB6B;
}
</style>