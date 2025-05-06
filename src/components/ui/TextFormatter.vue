<template>
  <div class="mt-2 flex gap-2">
    <template v-for="align in aligns">
      <TextAlignItem :align="align" :class="{'selected': model===align}"
                     @click="model=align"
      />
    </template>
    <button class="icon-btn border border-gray-200 ml-2"
            :class="{'selected': isTextBold}"
            @click="isTextBold = !isTextBold"
    >
      <font-awesome-icon :icon="['fas', `fa-bold`]" />
    </button>
  </div>
</template>

<script setup>
import TextAlignItem from "@/components/ui/TextAlignItem.vue";

const model = defineModel();
const isTextBold = defineModel('isTextBold');
const aligns = [
    'left', 'center', 'right',
  // 'justify', // pptxGenJs에는 해당 속성이 존재하지 않음
]

</script>

<style scoped>
.selected {
  background-color: var(--color-primary);
  color: white;
}

.selected:hover {
  opacity: 0.8;
}
</style>