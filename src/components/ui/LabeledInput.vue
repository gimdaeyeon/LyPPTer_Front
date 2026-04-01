<template>
  <div class="flex-1 relative">
    <label class="labeled-input-label">{{ label }}</label>
    <input class="input pl-14 pr-2" :type="type" :step="step"
           v-model="model"
    >
  </div>
</template>

<script setup>

const model = defineModel();

defineProps({
  label: {
    type: String
  },
  type: {
    default: 'text'
  },
  step: {
    default: undefined
  }
});
</script>

<style scoped>

</style>