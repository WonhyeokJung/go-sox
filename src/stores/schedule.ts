import { defineStore } from "pinia";
import { Ref, computed, ref } from "vue";
import { $_getGamesSchedule, $_getLiveGame, $_getBoxScore } from "@/api/get";
import { ScheduledGames, Schedule } from "@/types";
import { BoxScore, LiveGame } from "@/types/game";

export const useScheduleStore = defineStore('schedule', () => {
  const schedule: Ref<Array<ScheduledGames> | undefined> = ref()
  const liveGame: Ref<Array<LiveGame>> = ref([])
  const boxScore: Ref<Array<BoxScore> | undefined> = ref([])
  const getSchedule = computed(() => schedule.value)
  const getLiveGame = computed(() => liveGame.value)
  const getBoxScore = computed(() => boxScore.value)

  async function fetchSchedule(date?:string, teamId?:number) {
    const { data } = await $_getGamesSchedule(date, teamId) // get함수에 기본 설정 되어 있어서 안 넘기면 당일 삭스 경기 출력
    // 게임이 없는 날 방지
    schedule.value = data.dates[0]?.games
    // 기존 데이터에 추가 방지되도록 reset
    liveGame.value = []
    boxScore.value = []
    if (schedule.value) {
      for (let i = 0; i < schedule.value.length; i++) {
        if (!schedule.value[i].link) continue
        const { data } = await $_getLiveGame(schedule.value[i].link)
        liveGame.value?.push(data)
        boxScore.value?.push(await $_getBoxScore(liveGame.value![i].gamePk as number))
      }
    }
    return
  }
  return {
    getSchedule,
    getLiveGame,
    getBoxScore,
    fetchSchedule
  }
})