import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { $_getPlayerInfo } from "@/api/get";

export const usePlayerStore = defineStore('player', () => {
  let player = ref();
  const getPlayer = computed(() => player.value)

  async function fetchPlayer(path:string) {
    const { data, status } = await $_getPlayerInfo(path)
    player.value = data
  }

  return {
    player,
    getPlayer,
    fetchPlayer
  }
})