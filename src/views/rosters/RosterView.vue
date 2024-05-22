<script setup lang="ts">
  import { useLoadingStore } from '@/stores'
  import { storeToRefs } from 'pinia'

  const loadingStore = useLoadingStore()
  const { getIsLoading } = storeToRefs(loadingStore)
</script>

<template>
  <!-- slot이용해서 view 컴포넌트 하나로. dynamic route로 변경하고, params 이용해서 현재 타입 확인해서 보내기  -->
  <div class="roster-view">
    <h1>Roster</h1>
    <nav class="roster-view__nav">
      <!-- SPA에 새로고침 적용이 맞을까..? -->
      <router-link to="/roster">액티브(26-28인 로스터)</router-link> | 
      <router-link to="/roster/depth-chart">뎁스차트</router-link> | 
      <router-link to="/roster/40-man">40인 로스터</router-link> | 
      <router-link to="/roster/non-roster">non-roster invitees</router-link> |
      <!-- <router-link to="/roster/coaches">Coaches</router-link> -->
    </nav>
    <!-- loading중에 라우터 뷰 나오지 않도록 -->
    <router-view v-if="!getIsLoading"></router-view>
  </div>
</template>

<style scoped>
.roster-view {
  position: relative;
  z-index: 4;
}
</style>