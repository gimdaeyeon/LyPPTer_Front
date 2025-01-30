<template>
<!--    <router-view/>-->
  <div class="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style='font-family: "Plus Jakarta Sans", "Noto Sans", sans-serif;'>
    <div class="layout-container flex h-full grow flex-col">
      <header class="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#F4EFE6] px-10 py-3">
        <div class="flex items-center gap-4 text-[#1C160C]">
          <div class="size-4">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path></svg>
          </div>
          <h2 class="text-[#1C160C] text-lg font-bold leading-tight tracking-[-0.015em]">Lyrics-to-PPT Generator</h2>
        </div>
        <div class="flex flex-1 justify-end gap-8">
          <div class="flex items-center gap-9">
            <a class="text-[#1C160C] text-sm font-medium leading-normal" href="#">Home</a>
            <a class="text-[#1C160C] text-sm font-medium leading-normal" href="#">Tutorials</a>
            <a class="text-[#1C160C] text-sm font-medium leading-normal" href="#">FAQs</a>
            <a class="text-[#1C160C] text-sm font-medium leading-normal" href="#">Feedback</a>
          </div>
          <div class="flex gap-2">
            <button
                class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#019863] text-[#FFFFFF] text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span class="truncate">Export</span>
            </button>
            <button
                class="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 bg-[#F4EFE6] text-[#1C160C] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
            >
              <div class="text-[#1C160C]" data-icon="Share" data-size="20px" data-weight="regular">
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                  <path
                      d="M229.66,109.66l-48,48a8,8,0,0,1-11.32-11.32L204.69,112H165a88,88,0,0,0-85.23,66,8,8,0,0,1-15.5-4A103.94,103.94,0,0,1,165,96h39.71L170.34,61.66a8,8,0,0,1,11.32-11.32l48,48A8,8,0,0,1,229.66,109.66ZM192,208H40V88a8,8,0,0,0-16,0V208a16,16,0,0,0,16,16H192a8,8,0,0,0,0-16Z"
                  ></path>
                </svg>
              </div>
            </button>
          </div>
          <div
              class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style='background-image: url("https://cdn.usegalileo.ai/sdxl10/7a9a8be9-1695-433a-83f4-faaba9c28106.png");'
          ></div>
        </div>
      </header>
      <div class="gap-1 px-6 flex flex-1 justify-center py-5">
        <div class="layout-content-container flex flex-col max-w-[920px] flex-1">
          <div class="pb-3">
            <div class="flex border-b border-[#E9DFCE] px-4 gap-8">
              <a class="flex flex-col items-center justify-center border-b-[3px] border-b-[#019863] text-[#1C160C] pb-[13px] pt-4" href="#">
                <p class="text-[#1C160C] text-sm font-bold leading-normal tracking-[0.015em]">Preview</p>
              </a>
              <a class="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#A18249] pb-[13px] pt-4" href="#">
                <p class="text-[#A18249] text-sm font-bold leading-normal tracking-[0.015em]">Adjust Layout</p>
              </a>
            </div>
          </div>
          <div class="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
            <div class="flex flex-col gap-3 pb-3">
              <div
                  class="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                  style='background-image: url("https://cdn.usegalileo.ai/sdxl10/437a6257-2ac6-4d24-a9ba-1279c9ddfa78.png");'
              ></div>
              <div>
                <p class="text-[#1C160C] text-base font-medium leading-normal">Mountain Landscape</p>
                <p class="text-[#A18249] text-sm font-normal leading-normal">Serene mountain view with clear skies</p>
              </div>
            </div>
            <div class="flex flex-col gap-3 pb-3">
              <div
                  class="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                  style='background-image: url("https://cdn.usegalileo.ai/sdxl10/8b1d86c8-5cd1-4abd-8512-9f4452e7ca35.png");'
              ></div>
              <div>
                <p class="text-[#1C160C] text-base font-medium leading-normal">Tropical Beach</p>
                <p class="text-[#A18249] text-sm font-normal leading-normal">Sandy shores and crystal clear waters</p>
              </div>
            </div>
            <div class="flex flex-col gap-3 pb-3">
              <div
                  class="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                  style='background-image: url("https://cdn.usegalileo.ai/sdxl10/648ee6ff-2b74-4179-af92-cbe7f5ee1bf2.png");'
              ></div>
              <div>
                <p class="text-[#1C160C] text-base font-medium leading-normal">City Skyline</p>
                <p class="text-[#A18249] text-sm font-normal leading-normal">Urban landscape with towering skyscrapers</p>
              </div>
            </div>
          </div>
        </div>
        <div class="layout-content-container flex flex-col w-[360px]">
          <div class="pb-3">
            <div class="flex border-b border-[#E9DFCE] px-4 gap-8">
              <a class="flex flex-col items-center justify-center border-b-[3px] border-b-[#019863] text-[#1C160C] pb-[13px] pt-4" href="#">
                <p class="text-[#1C160C] text-sm font-bold leading-normal tracking-[0.015em]">Lyrics</p>
              </a>
              <a class="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#A18249] pb-[13px] pt-4" href="#">
                <p class="text-[#A18249] text-sm font-bold leading-normal tracking-[0.015em]">Settings</p>
              </a>
            </div>
          </div>
          <div class="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label class="flex flex-col min-w-40 flex-1">
                <textarea
                    placeholder="Type or paste lyrics here..."
                    class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1C160C] focus:outline-0 focus:ring-0 border border-[#E9DFCE] bg-[#FFFFFF] focus:border-[#E9DFCE] min-h-36 placeholder:text-[#A18249] p-[15px] text-base font-normal leading-normal"
                ></textarea>
            </label>
          </div>
        </div>
      </div>
      <div class="layout-content-container flex flex-col">
        <footer class="flex space gap-6 px-5 py-10 text-center @container">
          <div class="flex flex-wrap items-center justify-center gap-6 @[480px]:flex-row @[480px]:justify-around">
            <a class="text-[#A18249] text-base font-normal leading-normal min-w-40" href="#">Privacy Policy</a>
            <a class="text-[#A18249] text-base font-normal leading-normal min-w-40" href="#">Terms of Service</a>
          </div>
          <div class="flex flex-wrap justify-center gap-4">
            <a href="#">
              <div class="text-[#A18249]" data-icon="TwitterLogo" data-size="24px" data-weight="regular">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path
                      d="M247.39,68.94A8,8,0,0,0,240,64H209.57A48.66,48.66,0,0,0,168.1,40a46.91,46.91,0,0,0-33.75,13.7A47.9,47.9,0,0,0,120,88v6.09C79.74,83.47,46.81,50.72,46.46,50.37a8,8,0,0,0-13.65,4.92c-4.31,47.79,9.57,79.77,22,98.18a110.93,110.93,0,0,0,21.88,24.2c-15.23,17.53-39.21,26.74-39.47,26.84a8,8,0,0,0-3.85,11.93c.75,1.12,3.75,5.05,11.08,8.72C53.51,229.7,65.48,232,80,232c70.67,0,129.72-54.42,135.75-124.44l29.91-29.9A8,8,0,0,0,247.39,68.94Zm-45,29.41a8,8,0,0,0-2.32,5.14C196,166.58,143.28,216,80,216c-10.56,0-18-1.4-23.22-3.08,11.51-6.25,27.56-17,37.88-32.48A8,8,0,0,0,92,169.08c-.47-.27-43.91-26.34-44-96,16,13,45.25,33.17,78.67,38.79A8,8,0,0,0,136,104V88a32,32,0,0,1,9.6-22.92A30.94,30.94,0,0,1,167.9,56c12.66.16,24.49,7.88,29.44,19.21A8,8,0,0,0,204.67,80h16Z"
                  ></path>
                </svg>
              </div>
            </a>
            <a href="#">
              <div class="text-[#A18249]" data-icon="LinkedinLogo" data-size="24px" data-weight="regular">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path
                      d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z"
                  ></path>
                </svg>
              </div>
            </a>
            <a href="#">
              <div class="text-[#A18249]" data-icon="Share" data-size="24px" data-weight="regular">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path
                      d="M229.66,109.66l-48,48a8,8,0,0,1-11.32-11.32L204.69,112H165a88,88,0,0,0-85.23,66,8,8,0,0,1-15.5-4A103.94,103.94,0,0,1,165,96h39.71L170.34,61.66a8,8,0,0,1,11.32-11.32l48,48A8,8,0,0,1,229.66,109.66ZM192,208H40V88a8,8,0,0,0-16,0V208a16,16,0,0,0,16,16H192a8,8,0,0,0,0-16Z"
                  ></path>
                </svg>
              </div>
            </a>
          </div>
          <p class="text-[#A18249] text-base font-normal leading-normal">© 2023 Lyrics-to-PPT Generator</p>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>

</style>