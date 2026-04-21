<!-- src/components/ui/FontDropdown.vue -->
<template>
  <div class="w-full relative" ref="fontDropdownRef">
    <label class="text-sm font-medium">Font Family</label>
    <div class="input w-full p-2 border rounded cursor-pointer flex items-center justify-between"
         :class="{'opacity-60 pointer-events-none': isLoadingFont}"
         @click="openDropdown" style="height: auto; min-height: 2.5rem;">
      <span :style="{fontFamily: modelValue}">{{ modelValue }}</span>
      <svg v-if="isLoadingFont" class="w-4 h-4 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
      </svg>
      <svg v-else class="w-4 h-4 text-gray-400 transition-transform" :class="{'rotate-180': fontDropdownOpen}"
           fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
      </svg>
    </div>
    <div v-if="fontDropdownOpen"
         class="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg flex flex-col"
         style="max-height: 320px;">
      <!-- 검색 입력 -->
      <div class="p-2 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div class="relative">
          <svg class="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
          </svg>
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            placeholder="폰트 검색..."
            class="w-full pl-7 pr-2 py-1 text-sm border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded focus:outline-none focus:border-blue-400"
            @click.stop
          />
        </div>
      </div>
      <!-- 폰트 목록 -->
      <div ref="listRef" class="overflow-y-auto flex-1">
        <template v-if="hasResults">
          <template v-for="(group, label) in filteredFontGroups" :key="label">
            <div v-if="group.length"
                 class="px-3 py-1 text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wider bg-gray-50 dark:bg-gray-700/50 sticky top-0">
              {{ label }}
            </div>
            <div v-for="font in group" :key="font.name"
                 :data-font-name="font.name"
                 class="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-900 dark:text-gray-100"
                 :class="{'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300': modelValue === font.name}"
                 :style="loadedFonts.has(font.name) ? {fontFamily: font.name} : {}"
                 @click="selectFont(font)">
              {{ font.name }}
            </div>
          </template>
        </template>
        <div v-else class="px-3 py-4 text-sm text-gray-400 dark:text-gray-500 text-center">
          검색 결과가 없습니다.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef, watch} from 'vue'
import {fontFamilies} from '@/utils/fontFamily.js'
import {loadFont, loadedFonts} from '@/composables/useFontLoader.js'

const props = defineProps({
    modelValue: {type: String, required: true},
})
const emit = defineEmits(['update:modelValue'])

const fontDropdownRef = useTemplateRef('fontDropdownRef')
const searchInputRef = useTemplateRef('searchInputRef')
const listRef = useTemplateRef('listRef')
const fontDropdownOpen = ref(false)
const searchQuery = ref('')
const isLoadingFont = ref(false)

let intersectionObserver = null

const fontGroups = computed(() => {
    const groups = {}
    for (const f of fontFamilies) {
        const label = f.source === 'system' ? 'System' : f.source === 'bundled' ? 'Bundled' : 'Google Fonts'
        if (!groups[label]) groups[label] = []
        groups[label].push(f)
    }
    return groups
})

const filteredFontGroups = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    if (!q) return fontGroups.value
    const result = {}
    for (const [label, fonts] of Object.entries(fontGroups.value)) {
        const matched = fonts.filter(f => f.name.toLowerCase().includes(q))
        if (matched.length) result[label] = matched
    }
    return result
})

const hasResults = computed(() =>
    Object.values(filteredFontGroups.value).some(g => g.length > 0)
)

function setupIntersectionObserver() {
    intersectionObserver?.disconnect()
    if (!listRef.value) return
    intersectionObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (!entry.isIntersecting) continue
            const fontName = entry.target.dataset.fontName
            const font = fontFamilies.find(f => f.name === fontName)
            if (font) loadFont(font)
        }
    }, {root: listRef.value, threshold: 0})

    listRef.value.querySelectorAll('[data-font-name]').forEach(el => {
        intersectionObserver.observe(el)
    })
}

// 검색어가 바뀌면 새로 렌더된 아이템들 다시 observe
watch(searchQuery, async () => {
    await nextTick()
    setupIntersectionObserver()
})

watch(fontDropdownOpen, async (open) => {
    if (open) {
        searchQuery.value = ''
        await nextTick()
        searchInputRef.value?.focus()
        setupIntersectionObserver()
    } else {
        intersectionObserver?.disconnect()
        intersectionObserver = null
    }
})

async function openDropdown() {
    if (isLoadingFont.value) return
    fontDropdownOpen.value = !fontDropdownOpen.value
}

async function selectFont(font) {
    isLoadingFont.value = true
    fontDropdownOpen.value = false
    searchQuery.value = ''
    // 폰트 로드 완료 후 emit → 입력창에서 fallback 깜빡임 방지
    await loadFont(font)
    emit('update:modelValue', font.name)
    isLoadingFont.value = false
}

function onClickOutside(e) {
    if (fontDropdownRef.value && !fontDropdownRef.value.contains(e.target)) {
        fontDropdownOpen.value = false
        searchQuery.value = ''
    }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => {
    document.removeEventListener('click', onClickOutside)
    intersectionObserver?.disconnect()
})
</script>
