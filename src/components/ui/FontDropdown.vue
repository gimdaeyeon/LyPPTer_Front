<!-- src/components/ui/FontDropdown.vue -->
<!-- 폰트 선택 드롭다운 컴포넌트 (LyricsSettings에서 분리) -->
<template>
  <div class="w-full relative" ref="fontDropdownRef">
    <label class="text-sm font-medium">Font Family</label>
    <div class="input w-full p-2 border rounded cursor-pointer flex items-center justify-between"
         @click="fontDropdownOpen = !fontDropdownOpen">
      <span :style="{fontFamily: modelValue}">{{ modelValue }}</span>
      <svg class="w-4 h-4 text-gray-400 transition-transform" :class="{'rotate-180': fontDropdownOpen}"
           fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
      </svg>
    </div>
    <div v-if="fontDropdownOpen"
         class="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
      <template v-for="(group, label) in fontGroups" :key="label">
        <div class="px-3 py-1 text-[11px] text-gray-400 uppercase tracking-wider bg-gray-50 sticky top-0">
          {{ label }}
        </div>
        <div v-for="font in group" :key="font.name"
             class="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
             :class="{'bg-blue-50 text-blue-700': modelValue === font.name}"
             :style="{fontFamily: font.name}"
             @mouseenter="preloadFont(font)"
             @click="selectFont(font)">
          {{ font.name }}
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import {computed, onBeforeUnmount, onMounted, ref, useTemplateRef} from 'vue'
import {fontFamilies} from '@/utils/fontFamily.js'
import {loadFont} from '@/composables/useFontLoader.js'

const props = defineProps({
    modelValue: {type: String, required: true},
})
const emit = defineEmits(['update:modelValue'])

const fontDropdownRef = useTemplateRef('fontDropdownRef')
const fontDropdownOpen = ref(false)

const fontGroups = computed(() => {
    const groups = {}
    for (const f of fontFamilies) {
        const label = f.source === 'system' ? 'System' : f.source === 'bundled' ? 'Bundled' : 'Google Fonts'
        if (!groups[label]) groups[label] = []
        groups[label].push(f)
    }
    return groups
})

function preloadFont(font) {
    loadFont(font)
}

function selectFont(font) {
    loadFont(font)
    emit('update:modelValue', font.name)
    fontDropdownOpen.value = false
}

function onClickOutside(e) {
    if (fontDropdownRef.value && !fontDropdownRef.value.contains(e.target)) {
        fontDropdownOpen.value = false
    }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
</script>
