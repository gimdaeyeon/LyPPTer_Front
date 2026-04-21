<template>
  <div class="flex flex-col px-4 py-3">
    <label class="flex flex-col min-w-40">
        <TextArea ref="textarea" @keyup="setCurrentSlide" @click="setCurrentSlide"
                  placeholder="Type or paste lyrics here..."
                  class="text-area form-input flex w-full min-w-0 resize-none overflow-y-scroll rounded-xl focus:outline-0 border
            border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
            placeholder:text-secondary p-[15px] text-base leading-normal"
                  :style="{ height: textareaHeight + 'px' }"
                  v-model="localLyrics"
        />
        <div class="cursor-row-resize flex items-center justify-center py-1.5 group"
             @mousedown.prevent="startResize"
             @touchstart.prevent="startResize">
          <div class="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400 dark:group-hover:bg-gray-500 transition-colors"></div>
        </div>
    </label>
  </div>
</template>

<script setup>

import TextArea from "@/components/common/tag/TextArea.vue";

import {useLyrics} from "@/store/useLyrics.js";
import {normalizeNewlines} from "@/utils/lyricsUtils.js";
import {storeToRefs} from "pinia";
import {onMounted, ref, useTemplateRef, watch} from "vue";

const STORAGE_KEY = 'lyricsTextareaHeight';
const MIN_HEIGHT = 200;
const MAX_HEIGHT = 2000;
const DEFAULT_HEIGHT = 500;

const textareaHeight = ref(
  Number(localStorage.getItem(STORAGE_KEY)) || DEFAULT_HEIGHT
);

watch(textareaHeight, (h) => {
  localStorage.setItem(STORAGE_KEY, String(h));
});

function startResize(e) {
  const startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
  const startHeight = textareaHeight.value;

  function onMove(moveEvent) {
    const currentY = moveEvent.type === 'touchmove' ? moveEvent.touches[0].clientY : moveEvent.clientY;
    const newHeight = startHeight + (currentY - startY);
    textareaHeight.value = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, newHeight));
  }

  function onUp() {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onUp);
  }

  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
  document.addEventListener('touchmove', onMove);
  document.addEventListener('touchend', onUp);
}

const lyricsStore = useLyrics();
const {lyrics, currentSlideIdx} = storeToRefs(lyricsStore);
const textarea = useTemplateRef('textarea');
const localLyrics = ref('');
let isSyncingFromStore = false;

async function setCurrentSlide() {
  if (!textarea.value) return
  const pos = textarea.value.textarea.selectionStart
  const before = localLyrics.value.slice(0, pos)
  currentSlideIdx.value = before.split(/(?:\r?\n){2,}/).length - 1;
}

onMounted(() => {
  localLyrics.value = lyrics.value;
});

watch(localLyrics, (newLyrics) => {
  if (isSyncingFromStore) return;
  lyrics.value = normalizeNewlines(newLyrics);
}, { flush: 'sync' });

watch(lyrics, (newLyrics) => {
  if (newLyrics !== localLyrics.value && !textarea.value?.composing) {
    isSyncingFromStore = true;
    localLyrics.value = newLyrics;
    isSyncingFromStore = false;
  }
});

</script>
