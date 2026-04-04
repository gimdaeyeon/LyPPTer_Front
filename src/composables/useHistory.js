import {ref, computed} from 'vue'

const MAX_HISTORY = 50

/**
 * 상태 스냅샷 기반 Undo/Redo 히스토리 관리
 * @param {() => object} getState - 현재 상태를 plain object로 반환하는 함수
 * @param {(state: object) => void} setState - 스냅샷으로 상태를 복원하는 함수
 */
export function useHistory(getState, setState) {
    const undoStack = ref([])
    const redoStack = ref([])
    let _restoring = false

    const canUndo = computed(() => undoStack.value.length > 0)
    const canRedo = computed(() => redoStack.value.length > 0)

    /** 현재 상태가 복원 중인지 여부 (외부에서 watcher 무시용) */
    function isRestoring() {
        return _restoring
    }

    /** 현재 상태를 undo 스택에 push (redo 초기화) */
    function pushState() {
        if (_restoring) return
        const snapshot = structuredClone(getState())
        undoStack.value.push(snapshot)
        if (undoStack.value.length > MAX_HISTORY) {
            undoStack.value.shift()
        }
        redoStack.value = []
    }

    /** Undo: 현재 상태를 redo에 저장하고, undo 스택에서 복원 */
    function undo() {
        if (!canUndo.value) return
        const current = structuredClone(getState())
        redoStack.value.push(current)
        const prev = undoStack.value.pop()
        _restoring = true
        setState(prev)
        _restoring = false
    }

    /** Redo: 현재 상태를 undo에 저장하고, redo 스택에서 복원 */
    function redo() {
        if (!canRedo.value) return
        const current = structuredClone(getState())
        undoStack.value.push(current)
        const next = redoStack.value.pop()
        _restoring = true
        setState(next)
        _restoring = false
    }

    return {canUndo, canRedo, pushState, undo, redo, isRestoring}
}
