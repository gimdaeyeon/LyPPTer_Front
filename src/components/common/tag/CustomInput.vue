<template>
  <input v-model="model" @input="e=>emit('update:modelValue',e.target.value)"/>
</template>

<script setup>
const model = defineModel();
const emit = defineEmits(['update:modelValue']);
</script>

<style scoped>

</style>