<!-- src/components/SlideSnapGuides.vue -->
<!-- 드래그 중 스냅 가이드라인을 렌더링하는 순수 표시 컴포넌트 -->
<template>
  <template v-if="isDragging">
    <div v-for="line in lines" :key="line.key" :style="line.style"/>
  </template>
</template>

<script setup>
import {computed} from 'vue'
import {SLIDE_W, SLIDE_H} from '@/utils/pptUnits.js'

const props = defineProps({
    snapX: {type: Number, default: null},
    snapY: {type: Number, default: null},
    isDragging: {type: Boolean, default: false},
})

const lines = computed(() => {
    const result = []
    if (props.snapX !== null) {
        result.push({
            key: 'x',
            style: {
                position: 'absolute', top: '0', bottom: '0',
                left: (props.snapX / SLIDE_W * 100) + '%',
                width: '0',
                borderLeft: '1px dashed rgba(59,130,246,0.75)',
                pointerEvents: 'none',
                zIndex: '20',
            },
        })
    }
    if (props.snapY !== null) {
        result.push({
            key: 'y',
            style: {
                position: 'absolute', left: '0', right: '0',
                top: (props.snapY / SLIDE_H * 100) + '%',
                height: '0',
                borderTop: '1px dashed rgba(59,130,246,0.75)',
                pointerEvents: 'none',
                zIndex: '20',
            },
        })
    }
    return result
})
</script>
