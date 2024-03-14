<script setup lang="ts">
  import { inject } from 'vue';
  import { useRosterStore } from '@/stores'
  import { storeToRefs } from 'pinia';

  const rosterType = inject('rosterType')

  const rosterStore = useRosterStore()
  const { getDepthChart, getTeamRoster } =  storeToRefs(rosterStore)

</script>
<template>
  {{ $route.name }}
  <div v-if="$route.name === 'roster-depth-chart'">
    <div v-for="(depth, key, index) in getDepthChart">
      {{ key }}
      <hr>
      <ul v-for="(player, index) in depth">
        <li>{{ player }}</li>
        <li>{{ index }}</li>
      </ul>
    </div>
  </div>
  <div v-else v-for="(player, index) in getTeamRoster[rosterType as string]">
    <div>{{ index }}</div>
    <ul>
      <li>{{ index + 1 }}</li>
      <li>No.{{ player.jerseyNumber }}</li>
      <li>ID: {{ player.person.id }}</li>
      <li>Name: {{ player.person.fullName }}</li>
      <li>Link: {{ player.person.link }}</li>
      <li>{{ player.position }}</li>
    </ul>
  </div>
</template>
<style scoped>
  
</style>