<script setup lang="ts">
import { onMounted } from 'vue'
import { useLeagueStore, useTeamStore } from '@/stores'
import { storeToRefs } from 'pinia';

// defineProps<{ locale: string, translation: Function }>()
defineProps<{ locale: string, getTranslation: Function }>()
const leagueStore = useLeagueStore()
const teamStore = useTeamStore()

const { getLeagueInfo } = storeToRefs(leagueStore)
const { getTeamInfo } = storeToRefs(teamStore)
const { fetchTeamData } = teamStore
const { fetchLeagueData } = leagueStore;
await fetchLeagueData()
await fetchTeamData(145)
// fetch가 너무 빨라서 그냥 로딩창 보여주기용 ...
await new Promise(resolve => setTimeout(resolve, 3000))
onMounted(async () => {
  // 시즌이 끝났을 때 / 새해로 넘어갈때 날짜 조정용 테스트
  console.log(new Date('2024-11-9') > new Date('2024-11-30'))
})

</script>

<template>
  <div>
  <!-- <div v-if="getLeagueInfo && getLeagueInfo.leagues && getLeagueInfo.leagues[0]"> -->
    <!-- template에선 ref로 불러온 변수도 .value 필요 없음 / reactive는 원래 필요없음. 구조분해할당시 반응성 사라짐에 조심 -->
    {{ getLeagueInfo.leagues[0].name }}
    {{ getLeagueInfo.leagues[0].seasonDateInfo.seasonStartDate }}
    {{ getLeagueInfo.leagues[0].seasonDateInfo.seasonEndDate }}
    {{ getLeagueInfo.leagues[0].seasonDateInfo.allStarDate }}
    {{ getLeagueInfo.leagues[0].abbreviation }}
    <p>{{ `SEASON ${getLeagueInfo.leagues[0].season}` }}</p>
    <hr>
    <div>
    <!-- <div v-if="getTeamInfo && getTeamInfo.teams"> -->
      {{ getTeamInfo!.teams[0].abbreviation }}
      {{ getTeamInfo!.teams[0].shortName }}
      {{ getTeamInfo!.teams[0].clubName }}
      {{ getTeamInfo!.teams[0].division.name }}
      {{ getTeamInfo!.teams[0].firstYearOfPlay }}
      {{ getTeamInfo!.teams[0].franchiseName }}
      {{ getTeamInfo!.teams[0].venue.name }}
      <!-- <h1>{{ getTeamInfo!.teams[0].name }}</h1> -->
      <h1>{{ getTranslation(locale, 'teamName') }}</h1>
      <h2>{{ getTranslation(locale, 'teamDescription') }}</h2>
    </div>
    <hr>
    <p>{{ getLeagueInfo.copyright }}</p>
  </div>
</template>

<style scoped>
h1, h2 {
  margin: 1rem;
  font-family: 'YEONGJUSeonbiTTF';
  font-weight: 1500;
}
.read-the-docs {
  color: #888;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
