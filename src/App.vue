<template>
  <div class="relative flex size-full min-h-screen flex-col bg-white dark:bg-gray-900 group/design-root overflow-x-hidden">
    <div class="layout-container flex h-full grow flex-col">
      <HeaderMenu/>
      <router-view/>
      <FooterMenu/>
    </div>
    <IntroModal v-if="isIntroOpen" @close="closeIntro"/>
  </div>
</template>

<script setup>
import {defineAsyncComponent, onMounted} from "vue";
import HeaderMenu from "@/layouts/HeaderMenu.vue";
import FooterMenu from "@/layouts/FooterMenu.vue";
import {useTheme} from "@/composables/useTheme.js";
import {useIntro} from "@/composables/useIntro.js";

// 인트로 팝업은 열릴 때만 불러온다 (첫 화면 번들에서 제외)
const IntroModal = defineAsyncComponent(() => import("@/components/intro/IntroModal.vue"));

useTheme()
const {isIntroOpen, closeIntro, openIntroIfFirstVisit} = useIntro()

// 앱 화면이 먼저 그려진 뒤 띄운다
onMounted(() => setTimeout(openIntroIfFirstVisit, 600))
</script>
