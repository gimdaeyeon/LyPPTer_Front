<template>
  <div class="mt-2 flex gap-2">
    <template v-for="align in aligns">
      <TextAlignItem :align="align" :class="{'selected': model===align}"
                     @click="model=align"
      />
    </template>

  </div>
</template>

<script setup>
import TextAlignItem from "@/components/ui/TextAlignItem.vue";

const model = defineModel();
const aligns = ['left', 'center', 'right', 'justify',]

</script>

<style scoped>
.selected {
  background-color: #00AB6B;
  color: white;
}

.selected:hover {
  opacity: 0.8;
}
</style>