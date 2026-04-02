<template>
  <textarea ref="textarea" v-model="model"></textarea>
</template>

<script setup>
import {useTemplateRef} from "vue";

const model = defineModel();
const textarea = useTemplateRef('textarea');
defineExpose({
  textarea,
})
</script>

<style scoped>

</style>