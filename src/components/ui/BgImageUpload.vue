<!-- src/components/ui/BgImageUpload.vue -->
<!-- 배경 설정 컴포넌트: 색상 또는 이미지 배경 선택 (LyricsSettings에서 분리) -->
<template>
  <div class="w-full">
    <div class="flex justify-between items-center">
      <label class="text-sm font-medium">Background</label>
      <div>
        <button class="icon-btn" :class="{selected: !isBgImg}" @click="emit('update:isBgImg', false)">
          <font-awesome-icon :icon="['fas', 'palette']"/>
        </button>
        <button class="icon-btn" :class="{selected: isBgImg}" @click="emit('update:isBgImg', true)">
          <font-awesome-icon :icon="['far', 'image']"/>
        </button>
      </div>
    </div>
    <div class="flex gap-2 mt-2">
      <template v-if="isBgImg">
        <input id="bg-img" class="hidden" type="file" accept="image/*" @change="onImageSelected" ref="fileRef">
        <label for="bg-img"
               class="input justify-center items-center gap-2 cursor-pointer hover:bg-gray-100 font-semibold px-4">
          <font-awesome-icon :icon="['fas', 'upload']"/>
          <span class="truncate">{{ fileName }}</span>
        </label>
        <button v-if="bgDataUrl" @click="clearImage" class="icon-btn text-sm">
          <font-awesome-icon :icon="['fas', 'x']"/>
        </button>
      </template>
      <template v-else>
        <input type="color" class="color-input" :value="bgColor"
               @input="emit('update:bgColor', $event.target.value)"/>
        <input type="text" class="text-input" :value="bgColor"
               @input="emit('update:bgColor', $event.target.value)"/>
      </template>
    </div>
  </div>
</template>

<script setup>
import {ref, useTemplateRef} from 'vue'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

const props = defineProps({
    isBgImg: {type: Boolean, required: true},
    bgColor: {type: String, required: true},
    bgDataUrl: {type: String, default: null},
})
const emit = defineEmits(['update:isBgImg', 'update:bgColor', 'file-selected', 'file-cleared'])

const fileRef = useTemplateRef('fileRef')
const fileName = ref('Choose image')

function onImageSelected(e) {
    const file = e.target.files?.[0]
    if (!file) return
    fileName.value = file.name
    emit('file-selected', file)
}

function clearImage() {
    fileName.value = 'Choose image'
    fileRef.value.value = ''
    emit('file-cleared')
}
</script>

<style scoped>
.selected {
    background-color: #E5F6F0;
}

.selected > svg {
    color: var(--color-primary);
}
</style>
