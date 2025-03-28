<template>
  <textarea ref="textarea" v-model="model" @input="e=>emit('update:modelValue',e.target.value)"></textarea>
</template>

<script setup>
import {useTemplateRef} from "vue";

const model = defineModel();
const emit = defineEmits(['update:modelValue']);
const textarea = useTemplateRef('textarea');
defineExpose({
  textarea,
})
</script>

<style scoped>

</style>