import { defineStore } from "pinia";
import { computed, ref, Ref } from 'vue'

export const useLocaleStore = defineStore('locale', () => {
  const locale = ref(navigator.language)
  const getLocale = computed(() => locale.value)

  function updateLocale(lang:string){
    locale.value = lang
    return
  }

  return {
    getLocale,
    updateLocale
  }
})