<template>
  <div class="flex flex-wrap gap-2 px-4 py-3 h-full">
    <div class="w-full">
      <label class="text-sm font-medium">Font Size</label>
      <input type="number" class="input mt-2"/>
    </div>
    <div class="w-full">
      <label class="text-sm font-medium">Text Alignment</label>
      <TextAlignSelector v-model="textAlign"/>
    </div>
    <div class="w-full">
      <label class="text-sm font-medium">Position</label>
      <input type="number" class="input mt-2"/>
    </div>
    <div class="w-full">
      <label class="text-sm font-medium">Text Box Size</label>
      <input type="number" class="input mt-2"/>
    </div>
    <div class="w-full">
      <label class="text-sm font-medium">Background</label>
      <input type="number" class="input mt-2"/>
    </div>
  </div>
</template>

<script setup>

import TextAlignSelector from "@/components/ui/TextAlignSelector.vue";
import {ref} from "vue";

const textAlign = ref('left');
</script>

<style scoped>

</style>