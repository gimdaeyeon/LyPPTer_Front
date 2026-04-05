import { ref, onScopeDispose } from 'vue'

export function useBreakpoint() {
  const SM = 640
  const LG = 1024

  const mqSm = window.matchMedia(`(min-width: ${SM}px)`)
  const mqLg = window.matchMedia(`(min-width: ${LG}px)`)

  const isMobile = ref(!mqSm.matches)
  const isTablet = ref(mqSm.matches && !mqLg.matches)
  const isDesktop = ref(mqLg.matches)

  function update() {
    isMobile.value = !mqSm.matches
    isTablet.value = mqSm.matches && !mqLg.matches
    isDesktop.value = mqLg.matches
  }

  mqSm.addEventListener('change', update)
  mqLg.addEventListener('change', update)

  onScopeDispose(() => {
    mqSm.removeEventListener('change', update)
    mqLg.removeEventListener('change', update)
  })

  return { isMobile, isTablet, isDesktop }
}
