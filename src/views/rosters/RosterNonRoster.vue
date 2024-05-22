<script setup lang="ts">
  import BaseRosterList from '@/components/BaseRosterList.vue'
</script>
<template>
  <h1>Non-Roster</h1>
  <p>Non-roster invitees list is not provided during the regular season</p>
  <p>{{ $route.name }}</p>
  <BaseRosterList />
</template>
<style scoped>
  
</style>