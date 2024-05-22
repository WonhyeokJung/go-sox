import { defineStore } from "pinia";
import { computed, ref } from "vue";
export const useLoadingStore = defineStore('loading', () => {
  const isLoading = ref(false);
  const getIsLoading = computed(() => isLoading.value)

  async function startLoading() {
    isLoading.value = true
  }
  async function endLoading() {
    isLoading.value = false
  }

  return {
    getIsLoading,
    startLoading,
    endLoading
  }
})