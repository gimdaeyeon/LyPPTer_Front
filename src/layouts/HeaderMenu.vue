<template>
  <header class="flex items-center justify-between whitespace-nowrap border-b border-b-gray-200 px-10 py-3">
    <router-link to="/" class="flex items-center gap-4 cursor-pointer">
      <div class="size-4">
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path></svg>
      </div>
      <h2 class="text-lg font-bold leading-tight tracking-[-0.015em]">Lyppter</h2>
    </router-link>
    <div class="flex flex-1 justify-end gap-8">
      <div class="flex items-center gap-9">
        <router-link v-for="menu in menus" class="h-menu-item" :to="menu.link">{{menu.label}}</router-link>
      </div>
      <div class="flex gap-2">
        <button
            class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 bg-primary hover:bg-[#009960] text-white text-sm font-bold leading-normal tracking-[0.015em]"
        >
          <span class="truncate">Export</span>
        </button>
      </div>
      <div
          class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
          style='background-image: url("https://cdn.usegalileo.ai/sdxl10/7a9a8be9-1695-433a-83f4-faaba9c28106.png");'
      ></div>
    </div>
  </header>
</template>

<script setup>

import {ref} from "vue";

const menus = ref([
  {label: 'Home',link:'#'},
  {label: 'Tutorials',link:'#'},
  {label: 'FAQs',link:'#'},
  {label: 'Feedback',link:'#'},
]);

</script>

<style scoped>


</style>