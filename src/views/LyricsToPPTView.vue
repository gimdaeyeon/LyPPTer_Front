<template>
  <div class="gap-1 px-6 flex flex-1 justify-center py-5">
    <div class="layout-content-container flex flex-col max-w-[920px] flex-1">
      <div class="pb-3">
        <div class="flex border-b border-gray-200 px-4 gap-8">
          <a class="flex flex-col items-center justify-center border-b-[3px] border-b-[#00AB6B] text-[#1C160C] pb-[13px] pt-4" href="#">
            <p class="text-[#1C160C] text-sm font-bold leading-normal tracking-[0.015em]">Preview</p>
          </a>
          <a class="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#A18249] pb-[13px] pt-4" href="#">
            <p class="text-[#B88746] text-sm font-bold leading-normal tracking-[0.015em]">Adjust Layout</p>
          </a>
        </div>
      </div>
      <div class="grid grid-cols-4 gap-3 p-4">
        <div class="flex flex-col gap-3 pb-3">
          <div
              class="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl border border-gray-400"
              style='background-image: url("https://cdn.usegalileo.ai/sdxl10/437a6257-2ac6-4d24-a9ba-1279c9ddfa78.png");'
          ></div>
          <div>
            <p class="font-medium leading-normal">slide1</p>
          </div>
        </div>
        <div class="flex flex-col gap-3 pb-3">
          <div
              class="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl border border-gray-400"
              style='background-image: url("https://cdn.usegalileo.ai/sdxl10/8b1d86c8-5cd1-4abd-8512-9f4452e7ca35.png");'
          ></div>
          <div>
            <p class="font-medium leading-normal">slide2</p>
          </div>
        </div>
        <div class="flex flex-col gap-3 pb-3">
          <div
              class="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl border border-gray-400"
              style='background-image: url("https://cdn.usegalileo.ai/sdxl10/648ee6ff-2b74-4179-af92-cbe7f5ee1bf2.png");'
          ></div>
          <div>
            <p class="font-medium leading-normal">slide3</p>
          </div>
        </div>
      </div>
    </div>
    <div class="layout-content-container flex flex-col w-[360px]">
      <div class="pb-3">
        <div class="flex border-b border-gray-200 px-4 gap-8">
          <a class="flex flex-col items-center justify-center border-b-[3px] border-b-[#00AB6B] text-[#1C160C] pb-[13px] pt-4" href="#">
            <p class="text-[#1C160C] text-sm font-bold leading-normal tracking-[0.015em]">Lyrics</p>
          </a>
          <a class="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#A18249] pb-[13px] pt-4" href="#">
            <p class="text-[#B88746] text-sm font-bold leading-normal tracking-[0.015em]">Settings</p>
          </a>
        </div>
      </div>
      <div class="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
        <label class="flex flex-col min-w-40 flex-1">
                <textarea
                    placeholder="Type or paste lyrics here..."
                    class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl focus:outline-0 focus:ring-0 border border-gray-200 bg-[#FFFFFF] focus:border-[#E9DFCE] min-h-36 placeholder:text-[#B88746] p-[15px] text-base font-normal leading-normal"
                ></textarea>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>

</style>