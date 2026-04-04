<template>
  <div class="overflow-hidden flex-[20_1_0]">
    <div class="h-full border-r border-gray-200">
      <div class="space-y-2 p-2 max-h-[72vh] overflow-y-scroll [&::-webkit-scrollbar]:hidden">
        <div v-for="(slide, i) in lyricsSlides" :key="i" class="relative">
          <!-- 드롭 인디케이터 (위쪽) -->
          <div
              v-if="showIndicator(i, 'before')"
              class="drop-indicator"
          />

          <SlideThumb
              :index="i"
              :lyrics="slide"
              :settings="lyricsStore.settings"
              :bg-data-url="thumbBgDataUrl"
              :active="i===currentSlideIdx"
              :can-delete="lyricsSlides.length > 1"
              :class="{
                'drag-source': dragFromIdx !== null && dragFromIdx === i,
                'drag-over': dropTargetIdx === i && dropTargetIdx !== dragFromIdx,
              }"
              @click="currentSlideIdx=i"
              @delete="onDelete"
              @duplicate="onDuplicate"
              @dragstart="onDragStart"
              @dragover="onDragOver"
              @dragend="onDragEnd"
              @drop="onDrop"
              :ref="el => (thumbEls[i] = el?.$el ?? el)"
          />

          <!-- 드롭 인디케이터 (아래쪽, 마지막 슬라이드) -->
          <div
              v-if="showIndicator(i, 'after')"
              class="drop-indicator drop-indicator-bottom"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useLyrics} from '@/store/useLyrics.js';
import {storeToRefs} from 'pinia';
import SlideThumb from "@/components/SlideThumb.vue";
import {nextTick, ref, watch} from "vue";

const lyricsStore = useLyrics();
const {lyricsSlides, currentSlideIdx, thumbBgDataUrl, lyrics} = storeToRefs(lyricsStore);
// 썸네일 엘리먼트 배열을 담을 ref
const thumbEls = ref([]);

// 활성 슬라이드가 바뀔 때 자동 스크롤
/* 길이 변화 → 새 슬라이드 등장 */
watch(() => lyricsSlides.value.length, doScroll, {flush: 'post'})

/* 커서 이동 등으로 인덱스만 변할 때(이미 존재하는 노드) */
watch(currentSlideIdx, doScroll, {flush: 'post', immediate: false})

function doScroll() {
  nextTick(() => {
    thumbEls.value[currentSlideIdx.value]
        ?.scrollIntoView({block: 'center', behavior: 'smooth'})
  })
}

/* ---------- 슬라이드 삭제/복제 ----------------------------------------- */
function onDelete(index) {
  lyricsStore.snapshotNow()
  lyricsStore.deleteSlide(index)
}

function onDuplicate(index) {
  lyricsStore.snapshotNow()
  lyricsStore.duplicateSlide(index)
}

/* ---------- 드래그 앤 드롭 (슬라이드 순서 변경) -------------------------- */
const dragFromIdx = ref(null)
const dropTargetIdx = ref(null)

function onDragStart(e, index) {
  dragFromIdx.value = index
  e.dataTransfer.effectAllowed = 'move'
}

function onDragOver(e, index) {
  if (dragFromIdx.value === null) return
  dropTargetIdx.value = index
}

function onDragEnd() {
  dragFromIdx.value = null
  dropTargetIdx.value = null
}

function onDrop(e, toIndex) {
  if (dragFromIdx.value === null || dragFromIdx.value === toIndex) {
    onDragEnd()
    return
  }
  lyricsStore.snapshotNow()
  lyricsStore.moveSlide(dragFromIdx.value, toIndex)
  onDragEnd()
}

/** 드롭 인디케이터 표시 여부 */
function showIndicator(i, position) {
  if (dragFromIdx.value === null || dropTargetIdx.value === null) return false
  if (dropTargetIdx.value === dragFromIdx.value) return false
  if (position === 'before') {
    return dropTargetIdx.value === i && i < dragFromIdx.value
  }
  // 'after': 마지막 슬라이드 아래에 표시할 때
  return dropTargetIdx.value === i && i > dragFromIdx.value
}
</script>

<style scoped>
.drag-source {
  opacity: 0.35;
  transform: scale(0.95);
  transition: all 0.2s ease;
}

.drag-over {
  transform: scale(1.02);
  transition: transform 0.15s ease;
}

.drop-indicator {
  height: 3px;
  background: var(--color-primary, #00AB6B);
  border-radius: 2px;
  margin: -2px 4px 4px;
  box-shadow: 0 0 6px var(--color-primary, #00AB6B);
  animation: pulse-indicator 1s ease-in-out infinite;
}

.drop-indicator-bottom {
  margin: 4px 4px -2px;
}

@keyframes pulse-indicator {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}
</style>
