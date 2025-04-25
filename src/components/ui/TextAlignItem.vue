<template>
  <button class="icon-btn border border-gray-200">
    <font-awesome-icon :icon="['fas', `fa-align-${align}`]" />
  </button>
</template>

<script setup>
defineProps(['align']);
</script>

<style scoped>

</style>