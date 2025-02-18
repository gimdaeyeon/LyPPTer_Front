<template>
  <button class="text-align-btn">
      <i :class="`fa-solid fa-align-${align}`"></i>
  </button>
</template>

<script setup>
defineProps(['align']);
</script>

<style scoped>

</style>