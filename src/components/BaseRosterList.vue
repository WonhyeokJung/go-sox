<script setup lang="ts">
  import { useRosterStore } from '@/stores'
  import { storeToRefs } from 'pinia';
  import { useRoute } from 'vue-router';

  interface Status {
    [name: string]: string,
  }

  const rosterType = useRoute().meta.rosterType
  
  const rosterStore = useRosterStore()
  const { getDepthChart, getTeamRoster } =  storeToRefs(rosterStore)
  const env = import.meta.env.MODE
  const position = ['Bullpen', 'Catcher', 'First Base', 'Second Base', 'Third Base', 'Shortstop', 'Left Field', 'Center Field', 'Right Field', 'Designated Hitter', 'Rotation']
  const status: Status = {
    'DES': '지명할당',
    'A': '',
    'NRI': '초청 선수',
    'D60': 'IL-60',
    'D10': 'IL-10',
    'RM': 'MINORS'
  }
</script>
<template>
  <!-- depth chart 출력용 -->
  <div v-if="$route.name === 'roster-depth-chart'" class="roster-table-container">
    <div v-for="(depth, key, index) in getDepthChart" :key="index">
      <table class="roster-table">
        <thead>
          <tr>
            <th>{{ position[index] }}</th>
            <th class="nationality">국적</th>
            <th class="height">키</th>
            <th class="weight">몸무게</th>
            <th class="bat-throw">타격/투구</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(player, index) in depth" :key="index">
            <td>
              <a href="#">{{ player.person.fullName }}</a> <span>{{ player.personalInfo?.primaryNumber }}</span> <span class="player-status">{{ status[player.status.code] }}</span>
              <div class="roster-table__index--mobile">국적: {{ player.personalInfo?.birthCountry }} 키: {{ player.personalInfo?.height }} 몸무게: {{ player.personalInfo?.weight }} {{ `${ player.personalInfo?.batSide.code }/${ player.personalInfo?.pitchHand.code }` }}</div>
            </td>
            <td class="nationality">{{ player.personalInfo?.birthCountry }}</td>
            <td class="height">{{ player.personalInfo?.height }}</td>
            <td class="weight">{{ player.personalInfo?.weight }}</td>
            <td class="bat-throw">{{ `${ player.personalInfo?.batSide.code }/${ player.personalInfo?.pitchHand.code }` }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <!-- depth chart 아닐시 -->
  <div v-else>
    <table class="roster-table">
      <thead>
        <tr>
          <!-- <th>번호</th> -->
          <th>이름</th>
          <th v-if="env == 'development'">ID</th>
          <th>국적</th>
          <th>키</th>
          <th>타격/투구</th>
          <th>포지션</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(player, index) in getTeamRoster[rosterType as string]" :key="index">
          <!-- <td>{{ index + 1 }}</td> -->
          <td class="name"><a href="#">{{ player.person.fullName }}</a> <span>{{ player.jerseyNumber }}</span> <span class="player-status">{{ status[player.status.code] }}</span></td>
          <td v-if="env == 'development'">{{ player.person.id }}</td>
          <td>{{ player.personalInfo?.birthCountry }}</td>
          <td>{{ player.personalInfo?.height }}</td>
          <td>{{ `${ player.personalInfo?.batSide.code }/${ player.personalInfo?.pitchHand.code }` }}</td>
          <td>{{ player.position.abbreviation }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style scoped>
  .roster-table {
    width: 100%;
    margin: 0 auto;
  }
  
  .roster-table__index--mobile {
    display: none;
  }

  @media (max-width: 568px) {
    .roster-table {
      font-size: 0.8rem;
    }

    .roster-table__index--mobile {
      display: block;
    }

    .roster-table .nationality, .roster-table .height, .roster-table .weight, .roster-table .bat-throw {
      display: none;
    }
  }

  .roster-table .name {
    text-align: center;
  }

  .player-status {
    font-size: 0.7rem;
    color: red;
  }
</style>