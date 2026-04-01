import {reactive} from 'vue'

const loadedFonts = reactive(new Set())
const loadingFonts = reactive(new Set())

/**
 * Google Font를 동적으로 로드
 * @param {Object} fontEntry - { name, source } 폰트 정보
 * @returns {Promise<boolean>} 로드 성공 여부
 */
export async function loadFont(fontEntry) {
    if (!fontEntry || loadedFonts.has(fontEntry.name)) return true
    if (fontEntry.source !== 'google') {
        loadedFonts.add(fontEntry.name)
        return true
    }
    if (loadingFonts.has(fontEntry.name)) return true

    loadingFonts.add(fontEntry.name)

    const familyParam = fontEntry.name.replace(/ /g, '+')
    const href = `https://fonts.googleapis.com/css2?family=${familyParam}:wght@400;700&display=swap`

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href

    return new Promise((resolve) => {
        link.onload = async () => {
            await document.fonts.ready
            loadedFonts.add(fontEntry.name)
            loadingFonts.delete(fontEntry.name)
            resolve(true)
        }
        link.onerror = () => {
            loadingFonts.delete(fontEntry.name)
            resolve(false)
        }
        document.head.appendChild(link)
    })
}

/**
 * 폰트명으로 fontFamilies에서 찾아 로드
 * @param {string} fontName
 * @param {Array} fontList - fontFamilies 배열
 */
export async function loadFontByName(fontName, fontList) {
    const entry = fontList.find(f => f.name === fontName)
    if (entry) return loadFont(entry)
    return true
}

export {loadedFonts, loadingFonts}
