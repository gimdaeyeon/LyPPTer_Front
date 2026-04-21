<template>
  <div class="relative flex size-full min-h-screen flex-col bg-white dark:bg-gray-900 group/design-root overflow-x-hidden">
    <div class="layout-container flex h-full grow flex-col">
      <HeaderMenu/>
      <router-view/>
      <FooterMenu/>
    </div>
  </div>
</template>

<script setup>
import HeaderMenu from "@/layouts/HeaderMenu.vue";
import FooterMenu from "@/layouts/FooterMenu.vue";
import {useTheme} from "@/composables/useTheme.js";

useTheme()
</script>
