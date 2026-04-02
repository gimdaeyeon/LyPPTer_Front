<template>
  <textarea
    ref="textarea"
    :value="model"
    @compositionstart="composing = true"
    @compositionend="onCompositionEnd"
    @input="onInput"
  ></textarea>
</template>

<script setup>
import {ref, useTemplateRef} from "vue";

const model = defineModel();
const textarea = useTemplateRef('textarea');
const composing = ref(false);

function onInput(e) {
  model.value = e.target.value;
}

function onCompositionEnd(e) {
  composing.value = false;
  model.value = e.target.value;
}

defineExpose({
  textarea,
  composing,
})
</script>

<style scoped>

</style>