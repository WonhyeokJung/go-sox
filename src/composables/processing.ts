import { ref } from "vue";
// 중복 호출 방지 로직
export default function useProcessing() {
  const isProcessing = ref(false)
  const currentType = ref('none')
  function startProcessing(type:string) {
    if (currentType.value === type) return true
    currentType.value = type
    isProcessing.value = !isProcessing.value
    return null
  }

  function endProcessing() {
    // 이미 false면 할 필요 없음.
    if (!isProcessing.value) return
    isProcessing.value = !isProcessing.value
  }

  return {
    startProcessing,
    endProcessing
  }
}