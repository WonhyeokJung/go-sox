import { computed, Ref, ref } from 'vue'
import { defineStore } from 'pinia'
import { usePlayerStore as playerStore } from './'
import { $_getTeamRoster } from '@/api/get'
import { DepthChart, RosterType } from '@/types'

export const useRosterStore = defineStore('roster', () => {
  // state
  // count등으로 반응성 살려 화면에 출력해야 하는 경우, reactive는 구조 분해 할당시 반응성이 죽는 점에 유의할 것.
  let teamRoster: Ref<RosterType> = ref({}) as Ref<RosterType>
  let depthChart: Ref<DepthChart | undefined> = ref({ 
    'S': [],
    '1': [],
    '2': [],
    '3': [],
    '4': [],
    '5': [],
    '6': [],
    '7': [],
    '8': [],
    '9': [],
    '10': [] 
  })
  
  // getters
  const getTeamRoster = computed(() => teamRoster.value)
  const getDepthChart = computed(() => depthChart.value)

  // actions
  async function fetchTeamRoster(date:string, rosterType:string) {
    try {
      // processing과 더불어 이중 중복 호출 방지
      if (teamRoster.value[rosterType]) return
      const { data } = await $_getTeamRoster(date, rosterType)
      // !! teamRoster = [] 하면 기존 배열 참조 끊어져서 못불러옴 !!
      // if (teamRoster.value[rosterType]) teamRoster.value[rosterType].length = 0;
      // non roster invitees 없을때 돌려보내기
      if (!data.roster) return
      for (const player of data.roster) {
        await playerStore().fetchPlayer(player.person.link)
        // Link 통해 개인정보 투입
        player.personalInfo = playerStore().getPlayer.people[0] // 배열에 담겨와서 [0]으로 받는다.
        if (!teamRoster.value[rosterType]) teamRoster.value[rosterType] = [player]
        else teamRoster.value[rosterType].push(player)
      }
    } catch(err) {
      console.error(err)
    }
  }

  async function fetchDepthChart(date:string, rosterType:string) {
    try {
      // 선발투수 목록이 있을 경우 되돌려보냄(데이터 호출 중복 방지)
      if (!teamRoster.value.depthChart || depthChart.value!['S'].length) return
      for (const player of teamRoster.value.depthChart) {
        // 필요없음. 이미 fetchTeamRoster에서 해줌.
        // await playerStore().fetchPlayer(player.person.link)
        // player.personalInfo = playerStore().getPlayer.people[0]

        // types.ts에서 index로 string이 올 수 있게 설정해줬다.
        depthChart.value?.[player.position.code].push(player)
      }

    } catch(err) {
      console.error(err)
    }
  }

  return {
    teamRoster,
    getTeamRoster,
    fetchTeamRoster,
    depthChart,
    getDepthChart,
    fetchDepthChart
  }
})