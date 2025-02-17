<template>
  <div class="flex flex-wrap gap-2 px-4 py-3 h-full">
    <div class="w-full">
      <label class="text-sm font-medium">Font Size</label>
      <input type="number" class="input mt-2"/>
    </div>
    <div class="w-full">
      <label class="text-sm font-medium">Text Alignment</label>
      <div class="mt-2 flex gap-2">
        <button class="border border-gray-200 size-10 rounded-md cursor-pointer hover:bg-gray-100">
          <i class="fa-solid fa-align-left"></i>
        </button>
        <button class="border border-gray-200 size-10 rounded-md cursor-pointer hover:bg-gray-100">
          <i class="fa-solid fa-align-center"></i>
        </button>
        <button class="border border-gray-200 size-10 rounded-md cursor-pointer hover:bg-gray-100">
          <i class="fa-solid fa-align-right"></i>
        </button>
        <button class="border border-gray-200 size-10 rounded-md cursor-pointer hover:bg-gray-100">
          <i class="fa-solid fa-align-justify"></i>
        </button>
      </div>
    </div>
    <div class="w-full">
      <label class="text-sm font-medium">Position</label>
      <input type="number" class="input mt-2"/>
    </div>
    <div class="w-full">
      <label class="text-sm font-medium">Text Box Size</label>
      <input type="number" class="input mt-2"/>
    </div>
    <div class="w-full">
      <label class="text-sm font-medium">Background</label>
      <input type="number" class="input mt-2"/>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>

</style>