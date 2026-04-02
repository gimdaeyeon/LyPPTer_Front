import {computed, nextTick, ref, watch} from 'vue'

/**
 * 텍스트박스 인라인 편집 composable
 * SlidePreview.vue에서 분리된 contenteditable 편집 로직
 *
 * @param {Ref} textElRef - contenteditable <p> 요소 ref
 * @param {Object} props - 컴포넌트 props (lyrics 사용)
 * @param {Function} emit - 컴포넌트 emit 함수
 */
export function useInlineEdit(textElRef, props, emit) {
    const isEditing = ref(false)

    // 편집 중 v-html 재렌더링 방지용 로컬 가사 상태
    const localLyrics = ref(props.lyrics || '')

    // 외부(SlidePreview 인라인 편집 등)에서 가사가 변경된 경우 동기화
    watch(() => props.lyrics, (val) => {
        if (!isEditing.value) {
            localLyrics.value = val || ''
        }
    })

    // 줄바꿈을 <br/>로 변환 (v-html용)
    const htmlLyrics = computed(() =>
        (localLyrics.value || '').replace(/\n/g, '<br/>')
    )

    function onBoxDblClick() {
        isEditing.value = true
        nextTick(() => {
            if (textElRef.value) {
                // v-html의 <br/> DOM 대신 순수 텍스트로 설정해 Enter 동작 일관성 확보
                textElRef.value.innerText = props.lyrics || ''
                textElRef.value.focus()
                // 커서를 텍스트 끝으로 이동
                const range = document.createRange()
                const sel = window.getSelection()
                range.selectNodeContents(textElRef.value)
                range.collapse(false)
                sel.removeAllRanges()
                sel.addRange(range)
            }
        })
    }

    // contenteditable 끝에 브라우저가 자동 추가하는 trailing \n 제거
    function getEditedText() {
        const text = textElRef.value?.innerText || ''
        // 연속 줄바꿈을 단일로 치환 (슬라이드 구분자 \n\n 혼입 방지) + trailing \n 제거
        return text.replace(/\n{2,}/g, '\n').replace(/\n$/, '')
    }

    function onEditInput() {
        if (!isEditing.value) return
        emit('update:lyrics', getEditedText())
    }

    function onEditBlur() {
        if (!isEditing.value) return
        const newText = getEditedText()
        localLyrics.value = newText
        emit('update:lyrics', newText)
        isEditing.value = false
    }

    function onEditKeydown(e) {
        if (e.key === 'Escape') {
            e.preventDefault()
            textElRef.value?.blur()
        } else if (e.key === 'Enter') {
            // 브라우저 기본 Enter 동작(<div>/<br><br> 삽입)을 막고 \n 직접 삽입
            e.preventDefault()
            // 슬라이드 구분자(\n\n)와 충돌 방지: 커서 앞뒤에 이미 \n이 있으면 차단
            const sel = window.getSelection()
            if (sel && sel.rangeCount > 0) {
                const range = sel.getRangeAt(0)
                const node = range.startContainer
                const offset = range.startOffset
                if (node.nodeType === Node.TEXT_NODE) {
                    const before = offset > 0 ? node.textContent[offset - 1] : ''
                    const after = offset < node.textContent.length ? node.textContent[offset] : ''
                    if (before === '\n' || after === '\n') return
                }
            }
            document.execCommand('insertText', false, '\n')
        }
    }

    return {isEditing, localLyrics, htmlLyrics, onBoxDblClick, onEditInput, onEditBlur, onEditKeydown}
}
