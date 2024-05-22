import { ref, Ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { $_getLeagueInfo } from '@/api/get'
import type { LeagueInfo } from '@/types'

export const useLeagueStore = defineStore('league', () => {
  const leagueInfo: Ref<LeagueInfo> = ref({ copyright: '', leagues: [] })
  const getLeagueInfo = computed<LeagueInfo>(() => leagueInfo.value)

  async function fetchLeagueData() {
    const { data } = await $_getLeagueInfo()
    leagueInfo.value = data;
  }
  
  return {
    getLeagueInfo,
    fetchLeagueData
  }
})