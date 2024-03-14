<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue'
import { useLeagueStore } from '@/stores'
import { storeToRefs } from 'pinia';
import useDate from '@/composables/date'

defineProps<{ msg: string }>()
const count: Ref<number> = ref(0)
const leagueStore = useLeagueStore()


const { leagueInfo, getLeagueInfo } = storeToRefs(leagueStore)
const { fetchLeagueData } = leagueStore

onMounted(() => {
  fetchLeagueData();
})
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="@/assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>

  {{ useDate() }}
  <!-- template에선 ref로 불러온 변수도 .value 필요 없음 / reactive는 원래 필요없음. 구조분해할당시 반응성 사라짐에 조심 -->
  <p>{{ leagueInfo.divisions[0] }}</p>
  <p>{{ getLeagueInfo.copyright }}</p>
  <h1>{{ msg }}</h1>
  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
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
