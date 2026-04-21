<template>
  <button class="icon-btn border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">
    <font-awesome-icon :icon="['fas', `fa-align-${direction}`]"/>
  </button>
</template>

<script setup>
defineProps(['direction']);
</script>
