import { defineStore } from "pinia";
import { Ref, computed, ref } from "vue";
import { Team } from "@/types";
import { $_getTeam } from "@/api/get";

export const useTeamStore = defineStore('team', () => {
  const teamInfo: Ref<Team|undefined> = ref()
  const getTeamInfo = computed(() => teamInfo.value)

  async function fetchTeamData(teamId:number) {
    const { data } = await $_getTeam(teamId)
    teamInfo.value = data
  }
  return {
    getTeamInfo,
    fetchTeamData
  }
})