<template>
  <button class="icon-btn border border-gray-200">
    <font-awesome-icon :icon="['fas', `fa-align-${direction}`]" />
  </button>
</template>

<script setup>
defineProps(['direction']);
</script>
