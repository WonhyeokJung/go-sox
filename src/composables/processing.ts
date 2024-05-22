import { ref } from "vue";
// 중복 호출 방지 로직
export default function useProcessing() {
  const isProcessing = ref(false)
  const types = ref([] as Array<string>)

  async function startProcessing(type:string) {
    // 이거까지 추가하면 depthChart 불러오는 도중 다른 타입으로 가도 기존거 안끝나면 불러오기 못함.
    // if (isProcessing.value) return true
    if (types.value.includes(type)) return true
    isProcessing.value = !isProcessing.value;
    types.value.push(type)
    return null
  }

  async function endProcessing(type: string) {
    if (!isProcessing.value) return
    // const idx = types.value.indexOf(type)
    // if (idx > -1) types.value = types.value.slice(idx, 1)
    isProcessing.value = !isProcessing.value;
  }

  return {
    startProcessing,
    endProcessing
  }
}