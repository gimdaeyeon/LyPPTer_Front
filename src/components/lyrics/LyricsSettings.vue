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
    <div class="w-full relative" ref="fontDropdownRef">
      <label class="text-sm font-medium">Font Family</label>
      <div class="input w-full p-2 border rounded cursor-pointer flex items-center justify-between"
           @click="fontDropdownOpen = !fontDropdownOpen">
        <span :style="{fontFamily}">{{ fontFamily }}</span>
        <svg class="w-4 h-4 text-gray-400 transition-transform" :class="{'rotate-180': fontDropdownOpen}"
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
      <div v-if="fontDropdownOpen"
           class="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
        <template v-for="(group, label) in fontGroups" :key="label">
          <div class="px-3 py-1 text-[11px] text-gray-400 uppercase tracking-wider bg-gray-50 sticky top-0">
            {{ label }}
          </div>
          <div v-for="font in group" :key="font.name"
               class="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
               :class="{'bg-blue-50 text-blue-700': fontFamily === font.name}"
               :style="{fontFamily: font.name}"
               @mouseenter="preloadFont(font)"
               @click="selectFont(font)">
            {{ font.name }}
          </div>
        </template>
      </div>
    </div>
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
    <div class="w-full">
      <div class="flex justify-between items-center">
        <label class="text-sm font-medium">Background</label>
        <div>
          <button class="icon-btn" :class="{selected:!isBgImg}" @click="isBgImg=false">
            <font-awesome-icon :icon="['fas', 'palette']"/>
          </button>
          <button class="icon-btn" :class="{selected:isBgImg}" @click="isBgImg=true">
            <font-awesome-icon :icon="['far', 'image']"/>
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
            <font-awesome-icon :icon="['fas', 'upload']"/>
            <span class="truncate">{{ fileName }}</span>
          </label>
          <button v-if="bgDataUrl" @click="clearImage" class="icon-btn text-sm">
            <font-awesome-icon :icon="['fas', 'x']"/>
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

import TextFormatter from "@/components/ui/TextFormatter.vue";
import LabeledInput from "@/components/ui/LabeledInput.vue";
import {useLyrics} from "@/store/useLyrics.js";
import {computed, onBeforeUnmount, onMounted, ref, toRefs, useTemplateRef} from "vue";
import {storeToRefs} from "pinia";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {fontFamilies} from "@/utils/fontFamily.js";
import {loadFont} from "@/composables/useFontLoader.js";

const lyricsStore = useLyrics();
const fileName = ref('Choose image');
const fileRef = useTemplateRef('fileRef');
const fontDropdownRef = useTemplateRef('fontDropdownRef');
const {bgDataUrl} = storeToRefs(lyricsStore);

const {
  fontSize, textAlign, positionX,
  positionY, textBoxWidth,
  textBoxHeight, isBgImg, bgColor, textColor,
  isTextBold, fontFamily, lineSpacing,
} = toRefs(lyricsStore.settings);

/* ---------- 폰트 드롭다운 --------------------------------------------- */
const fontDropdownOpen = ref(false);

const fontGroups = computed(() => {
  const groups = {};
  for (const f of fontFamilies) {
    const label = f.source === 'system' ? 'System' : f.source === 'bundled' ? 'Bundled' : 'Google Fonts';
    if (!groups[label]) groups[label] = [];
    groups[label].push(f);
  }
  return groups;
});

function preloadFont(font) {
  loadFont(font);
}

function selectFont(font) {
  loadFont(font);
  fontFamily.value = font.name;
  fontDropdownOpen.value = false;
}

function onClickOutside(e) {
  if (fontDropdownRef.value && !fontDropdownRef.value.contains(e.target)) {
    fontDropdownOpen.value = false;
  }
}

onMounted(() => document.addEventListener('click', onClickOutside));
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside));

/* ---------- 배경 이미지 ----------------------------------------------- */
function onImageSelected(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  fileName.value = file.name;
  lyricsStore.setBgFile(file);
}

function clearImage() {
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