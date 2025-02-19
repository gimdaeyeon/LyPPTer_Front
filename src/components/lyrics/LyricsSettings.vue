<template>
  <div class="flex flex-wrap gap-2 px-4 py-3 h-full">
    <div class="w-full">
      <label class="text-sm font-medium">Font Size</label>
      <input type="number" class="input px-3 mt-2"/>
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
      <div>
        <label class="text-sm font-medium">Background</label>
        <div>
          <button class="text-align-btn">
          </button>
        </div>
      </div>
      <input type="number" class="input px-3 mt-2"/>
    </div>
  </div>
</template>

<script setup>

import TextAlignSelector from "@/components/ui/TextAlignSelector.vue";
import {ref} from "vue";
import LabeledInput from "@/components/ui/LabeledInput.vue";

const textAlign = ref('left');
const positionX = ref(30);
const positionY = ref(50);
const textBoxWidth= ref(200);
const textBoxHeight= ref(200);

</script>

<style scoped>

</style>