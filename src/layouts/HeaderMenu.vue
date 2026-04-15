<template>
  <header class="flex items-center justify-between whitespace-nowrap border-b border-b-gray-200 px-4 sm:px-6 lg:px-10 py-3">
    <router-link to="/" class="flex items-center gap-2 cursor-pointer">
      <img src="/lyppter.png" alt="Lyppter" class="h-8 w-auto" />
      <h2 class="text-lg font-[1000] leading-tight tracking-[-0.015em]">Lyppter</h2>
    </router-link>
    <div class="flex flex-1 justify-end gap-8">
      <div class="flex gap-2">
        <button @click="createPPt"
                class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 bg-primary hover:bg-[#009960] text-white text-sm font-bold leading-normal tracking-[0.015em]"
        >
          <span class="truncate">Export</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import {createPPt} from "@/services/pptService.js";
</script>
