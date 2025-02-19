<template>
    <div class="flex-1 relative">
      <label class="labeled-input-label">{{label}}</label>
      <input class="input pl-14" min="50" max="500" :type="type"
             v-model="model"
      >
    </div>
</template>

<script setup>

const model = defineModel();

defineProps({
  label:{
    type: String
  },
  type:{
    default:'text'
  }
});
</script>

<style scoped>

</style>