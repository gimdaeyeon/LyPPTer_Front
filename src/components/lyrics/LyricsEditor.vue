<template>
  <div class="layout-content-container flex flex-col w-[360px]">
    <div class="pb-3">
      <div class="flex border-b border-gray-200 px-4 gap-8 tracking-[0.015em]">
        <a class="lyrics-mode-tab"
           :class="{'mode-on':!isSetMode}"
           @click.prevent="isSetMode=false"
        >
          <p class="mode-text">Lyrics</p>
        </a>
        <a class="lyrics-mode-tab"
           :class="{'mode-on':isSetMode}"
           @click.prevent="isSetMode=true"
        >
          <p class="mode-text">Settings</p>
        </a>
      </div>
    </div>
    <LyricsInput v-show="!isSetMode"/>
    <LyricsSettings v-show="isSetMode"/>
  </div>
</template>

<script setup>

import {ref} from "vue";
import LyricsInput from "@/components/lyrics/LyricsInput.vue";
import LyricsSettings from "@/components/lyrics/LyricsSettings.vue";

const isSetMode = ref(false);
</script>

<style scoped>

</style>