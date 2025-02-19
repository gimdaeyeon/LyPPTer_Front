<template>
  <button class="icon-btn border border-gray-200">
      <i :class="`fa-solid fa-align-${align}`"></i>
  </button>
</template>

<script setup>
defineProps(['align']);
</script>

<style scoped>

</style>