<template>
  <div class="gap-1 px-6 flex flex-1 justify-center py-5">
    <div class="layout-content-container flex max-w-[1200px] flex-1">
      <div class="overflow-hidden flex-[20_1_0]">
        <div class="h-full overflow-y-auto border-r border-gray-200">
          <div class="space-y-2 p-2">
            <div class="slide-item-box border-primary">
              <img class="absolute h-full w-full" alt="Slide 1" loading="lazy" decoding="async"
                   src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&amp;auto=format&amp;fit=crop&amp;q=60&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW91bnRhaW5zfGVufDB8fDB8fHww">
              <div class="slide-number">1</div>
            </div>
            <div class="slide-item-box border-transparent">
              <img class="absolute h-full w-full" alt="Slide 2" loading="lazy" decoding="async" data-nimg="fill"
                   src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&amp;auto=format&amp;fit=crop&amp;q=60&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmVhY2h8ZW58MHx8MHx8fDA%3D">
              <div class="slide-number">2</div>
            </div>
            <div class="slide-item-box border-transparent">
              <img class="absolute h-full w-full" alt="Slide 3" loading="lazy" decoding="async"
                   src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&amp;auto=format&amp;fit=crop&amp;q=60&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2l0eSUyMHNreWxpbmV8ZW58MHx8MHx8fDA%3D">
              <div class="slide-number">3</div>
            </div>
          </div>
        </div>
      </div>
      <div class="overflow-hidden flex-[80_1_0]">
        <div class="h-full p-4">
          <div class="mt-2"><h2 class="text-xl font-semibold mb-4">Adjust Layout</h2>
            <div class="aspect-video relative overflow-hidden rounded-lg border border-gray-200"><img
                alt="Mountain Landscape" loading="lazy" decoding="async" data-nimg="fill" class="object-cover"
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&amp;auto=format&amp;fit=crop&amp;q=60&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW91bnRhaW5zfGVufDB8fDB8fHww"
                style="position: absolute; height: 100%; width: 100%; inset: 0px; color: transparent;">
              <div
                  style="position: absolute; left: 44.0601%; top: 7.76009%; width: 200px; height: 100px; border: 2px dashed rgb(0, 171, 107); cursor: move; overflow: hidden;">
                <textarea
                    style="width: 100%; height: 100%; resize: none; border: none; background: transparent; outline: none; color: white; text-shadow: black 1px 1px 2px; font-size: 16px; padding: 5px;">Enter your text here</textarea>
                <div
                    style="position: absolute; right: -5px; bottom: -5px; width: 10px; height: 10px; background: rgb(0, 171, 107); cursor: se-resize;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <LyricsArea/>
  </div>
</template>

<script setup>

import LyricsArea from "@/components/LyricsArea.vue";
</script>

<style scoped>

</style>