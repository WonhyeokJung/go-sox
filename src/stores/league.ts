import { ref, Ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { $_getLeagueInfo } from '@/api/get'
import type { LeagueInfo } from '@/types'

export const useLeagueStore = defineStore('league', () => {
  const leagueInfo: Ref<LeagueInfo> = ref({ copyright: '', divisions: [] })
  const getLeagueInfo = computed<LeagueInfo>(() => leagueInfo.value)

  async function fetchLeagueData() {
    const { data } = await $_getLeagueInfo()
    leagueInfo.value = data;
  }
  
  return {
    leagueInfo,
    getLeagueInfo,
    fetchLeagueData
  }
})