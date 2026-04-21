<template>
  <header class="flex items-center justify-between whitespace-nowrap border-b border-b-gray-200 dark:border-b-gray-700 bg-white dark:bg-gray-900 px-4 sm:px-6 lg:px-10 py-3">
    <router-link to="/" class="flex items-center gap-2 cursor-pointer">
      <img src="/lyppter.png" alt="Lyppter" class="h-8 w-auto" />
      <h2 class="text-lg font-[1000] leading-tight tracking-[-0.015em] text-gray-900 dark:text-gray-100">Lyppter</h2>
    </router-link>
    <div class="flex flex-1 justify-end gap-3">
      <!-- 다크모드 토글 -->
      <button
        @click="toggleTheme"
        class="icon-btn flex items-center justify-center text-gray-500 dark:text-gray-400"
        :title="isDark ? '라이트 모드로 전환' : '다크 모드로 전환'"
      >
        <!-- 라이트 모드일 때: 달 아이콘 표시 -->
        <svg v-if="!isDark" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
        </svg>
        <!-- 다크 모드일 때: 태양 아이콘 표시 -->
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"/>
          <path stroke-linecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      </button>
      <button @click="createPPt"
              class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 bg-primary hover:bg-[#009960] text-white text-sm font-bold leading-normal tracking-[0.015em]"
      >
        <span class="truncate">Export</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import {createPPt} from "@/services/pptService.js";
import {useTheme} from "@/composables/useTheme.js";

const {isDark, toggleTheme} = useTheme()
</script>
