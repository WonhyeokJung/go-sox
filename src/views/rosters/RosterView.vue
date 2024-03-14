<script setup lang="ts">
  import { onMounted, ref, provide } from 'vue'
  import { useRosterStore } from '@/stores'
  import { useDate, useProcessing } from '@/composables';
  import { useRoute, useRouter } from 'vue-router';

  const date = ref(useDate());
  const route = useRoute();
  const router = useRouter();
  const rosterType = ref('active');
  // props의 드릴링 무시하고 자손에게 가기.
  provide('rosterType', rosterType)

  const { startProcessing, endProcessing } = useProcessing()
  const rosterStore = useRosterStore()
  const { fetchTeamRoster, fetchDepthChart } = rosterStore
  
  // onclick시 순서 위해서 async/await 적용
  async function onClickRosterLink(date:string, type:string) {
    // 엄청 빠르게 누르면 중복호출 하는데, boolean값 할당해서 방지? 아니면 한번에 다 불러올까 진짜로? boolean 할당해서 방지
    rosterType.value = type;
    if (startProcessing(rosterType.value)) return;
    await fetchTeamRoster(date, rosterType.value)
    if (rosterType.value === 'depthChart') await fetchDepthChart(date, rosterType.value)
    endProcessing()
  }
  onMounted(async () => {
    // 주소로 직접 쳐서 들어가는 사람 방지. 혹은 하위 주소로 데려오면 그냥 최상위 주소로 보내버릴까?
    await router.isReady();
    // route.name의 타입에 에러 발생하여 as string으로 해결. 하지만 string이 아닐 어떤 가능성이라도 발견되면 런타임 에러가 발생한다.
    if (route.name as string == 'roster-depth-chart') rosterType.value = 'depthChart'
    else if (route.name as string == 'roster-40-man') rosterType.value = '40Man'
    else if (route.name as string == 'roster-non-roster') rosterType.value = 'nonRosterInvitees'
    else rosterType.value = 'active'

    // Team Roster 불러온 후, 뎁스차트까지 미리 불러온다.
    await fetchTeamRoster(useDate(), rosterType.value)
    // 위에서 가져온 데이터가 depth chart가 아니면 or depthChart 객체가 이미 차 있으면 불러오지 않게 뒷단 처리 완료
    await fetchDepthChart(useDate(), 'depthChart')
  })
</script>

<template>
  <div class="roster-view">
    <h1>Roster</h1>
    <nav>
      <!-- SPA에 새로고침 적용이 맞을까..? -->
      <router-link to="/roster" @click.once="onClickRosterLink(date, 'active')">액티브(26-28인 로스터)</router-link> | 
      <router-link to="/roster/depth-chart" @click="onClickRosterLink(date, 'depthChart')">뎁스차트</router-link> | 
      <router-link to="/roster/40-man" @click="onClickRosterLink(date, '40Man')">40인 로스터</router-link> | 
      <router-link to="/roster/non-roster" @click="onClickRosterLink(date, 'nonRosterInvitees')">non-roster invitees</router-link> | 
    </nav>
    <router-view />
  </div>
</template>

<style scoped>
</style>