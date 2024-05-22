<script setup lang="ts">
  import { $_getTeam } from '@/api/get';
  import { TeamRecord } from '@/types';
  import { Ref, ref } from 'vue';
  defineProps<{
    standings: Array<TeamRecord>
  }>()
  interface TeamAbbr {
    [teamId: number]: string
  }
  const teamAbbr:Ref<TeamAbbr> = ref({})
  async function getTeamAbbreviation(teamId:number, season:string) {
    const { data } = await $_getTeam(teamId, season)
    if(data && data.teams) teamAbbr.value[teamId] = data.teams[0].abbreviation
    return
  }
</script>
<template>
  <slot name="division" />
  <div class="standings-table-container">
    <div class="standings-table-wrapper">
      <!-- <div class="slot-division"> -->
        <!-- <slot name="division"> -->
      <!-- </div> -->
      <table class="standings-table">
          <thead>
            <tr class="standings-table__tr">
              <th class="team">팀</th>
              <th class="gamesPlayed">경기</th>
              <th class="wins">승</th>
              <th class="losses">패</th>
              <th class="runsScored">팀 득점</th>
              <th class="runsAllowed">팀 실점</th>
              <th class="gameBehind">게임차</th>
              <th class="winningPer">승률</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(team, index) in standings" :key="index">
              <!-- 홈/어웨이 성적 -->
              <!-- <td>{{ team.records.splitRecords }}</td> -->
              <!-- 연승/연패 -->
              <!-- <td>{{ team.streak }}</td> -->
              <th class="pc">{{ team.team.name }}</th>
              <th class="mobile">{{ getTeamAbbreviation(team.team.id, team.season) }}</th>
              <th class="mobile">{{ teamAbbr[team.team.id] }}</th>
              <!-- <th>{{ team.team.abbreviation }}</th> -->
              <!-- <th>ABC</th> -->
              <td>{{ team.gamesPlayed }}</td>
              <td>{{ team.wins }}</td>
              <td>{{ team.losses }}</td>
              <td>{{ team.runsScored }}</td>
              <td>{{ team.runsAllowed }}</td>
              <td>{{ team.divisionGamesBack }}</td>
              <td>{{ team.winningPercentage }}</td>
            </tr>
          </tbody>
        </table>
    </div>
  </div>
</template>
<style scoped>
  /* 모바일 스크롤용 적용 */
  /* .slot-division {
    position: sticky;
    left: 0;
  } */
  .standings-table-container {
    position: relative;
    margin: 0 auto;
    /* max-width: calc(1080px - 150px); */
    max-width: 1080px;
  }

  .standings-table-wrapper {
    width: 100%;
    overflow: auto;
  }
  /* 스크롤바 숨김 */
  .standings-table-wrapper::-webkit-scrollbar {
    display: none;
  }

  .standings-table__tr th {
    width: 100px;
  }

  /* 모바일 스크롤용 적용 끝 */

  .standings-table {
    margin: 0 auto;
    width: 100%;
    /* max-width: 1080px; */
    border-collapse: collapse;
    /* border-spacing: 5px; */
  }

  .standings-table thead .team,
  .standings-table thead {
    height: 32px;
    border-bottom: 1px solid rgb(221,221,221);
  }
  .standings-table thead th {
    padding: 5px;
    font-size: 11px;
  }

  .standings-table__tr {
    text-transform: uppercase;
  }

  /* mobile 스크롤 테스트 임시용 2 */
  .standings-table thead .team,
  .standings-table tbody th {
    /* left, right, bottom, top중 하나 필수임 */
    position: sticky;
    width: 150px;
    left: 0;
    background-color: white;
  }
  .standings-table tbody th {
    min-width: 60px;
    padding: 8px;
    height: 40px;
  }
  .standings-table tbody td {
    /* table cell 높이 지 멋대로 바뀌는거 방지 위함 */
    position: relative;
    padding:8px;
    min-width: 60px;
    height: 40px;
    z-index: -1;
  }

  .mobile {
    display: none;
  }

  @media (max-width: 568px) {
    .mobile:nth-child(3) {
      display: block;
    }
    .pc {
      display: none;
    }
  }
</style>