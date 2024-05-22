import { defineStore } from "pinia";
import { Ref, computed, ref } from "vue";
import { $_getStandings, $_getTeam } from "@/api/get";
import { Standing, StandingRecord } from "@/types";

interface leagueStandings {
  [league: number]: Array<StandingRecord>
}

export const useStandingsStore = defineStore('standings', () => {
  const rawData: Ref<Standing | undefined> = ref();
  const standings: Ref<leagueStandings> = ref({
    103: [], // american
    104: [] // national
  });
  const getStandings = computed(() => standings.value)

  async function fetchStandings(leagueId=103, season:number | undefined = undefined, seasonType='regularSeason') {
    const { data } = await $_getStandings(leagueId, season, seasonType)
    rawData.value = data;
    // American league 창립 전인 1876~1900년에는 American league에는 records가 없음. 그래서 리그 아이디별 분할 작업이 필요가 없음.
    if(rawData.value!.records[0]) {
      standings.value[leagueId] = rawData.value!.records;
      // team Abbreviation 넣어주는 코드이긴한데.. 여기서 부르는게 나은지 StandingsTable에서 부르는게 나은지는 아직 잘 모르겠음..(어차피 모바일 화면에서만 필요해서 / 로딩 너무 느려짐)
      // for (let leagueStandings of standings.value[leagueId]) {
      //   for (let teamRecord of leagueStandings.teamRecords) {
      //     const { data } = await $_getTeam(teamRecord.team.id, season)
      //     teamRecord.team.abbreviation = data.teams[0].abbreviation 
      //   }
      // }
    } else {
      // 재진입시 초기화용(버튼으로 연도 선택 등 일어날 때)
      standings.value[103] = [];
      standings.value[104] = [];
    }
    return
  }

  return {
    getStandings,
    fetchStandings
  }
})