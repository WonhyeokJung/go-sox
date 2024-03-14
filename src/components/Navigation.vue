<!-- /roster 들어가면 최상단 navi에서 홈/로스터가 사라져서 못씀... nav가 두개 이상일때 해결책 찾아야 사용가능. -->
<!-- 데이터를 하위에서 emit해서? navigator를 각자쓰게?? 이게 더 복잡하지 않나..? ㅋㅋㅋㅋ -->
<script setup lang="ts">
  import { ref, Ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()

  // typescript 에러 방지
  //@ts-ignore
  let linkList:Ref<Array> = ref([])
  
  function fetchNavigator() {
    if (route.name === 'home') {
      linkList.value = [
        ['홈', '/'],
        ['로스터', '/roster']
      ]
    }
  }
  onMounted(async () => {
    await router.isReady()
    fetchNavigator();
  })
</script>
<template>
  <router-link v-for="(link, index) in linkList" :to="link[1]">{{ link[0] }}   </router-link>
</template>
<style scoped>
  
</style>