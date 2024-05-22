<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useStandingsStore } from '@/stores';
  import TheStandingsTable from '@/components/TheStandingsTable.vue';
  import TheStandingsSkeletonLoader from '@/components/TheStandingsSkeletonLoader.vue'
  import { useDate } from '@/composables';
  import { useRoute, useRouter } from 'vue-router';

  defineProps<{ locale: string, getTranslation: Function }>()

  const date = useDate()
  // 주소창 직접 검색시 연도 확인용
  const route = useRoute()
  const router = useRouter()
  const isLoadingStandings = ref(false)
  const year = ref(Number(route.params.season) || date.year)
  const standingsStore = useStandingsStore()
  const { getStandings } = storeToRefs(standingsStore)
  const { fetchStandings } = standingsStore

  // 연도별로 버튼 정지용
  const next = ref()
  const last = ref()

  async function fetchData(selectYear: undefined | number = undefined) {
    if (selectYear) year.value = selectYear
    // StandingsLoadingPage를 따로 만드는 것도 괜찮을지도?
    isLoadingStandings.value = true
    await fetchStandings(103, year.value)
    await fetchStandings(104, year.value)
    isLoadingStandings.value = false
    return
  }

  // 연도 직접 선택 리스트
  async function changeYear(selectYear: number) {
    // year.value = selectYear
    // await fetchStandings(103, year.value)
    // await fetchStandings(104, year.value)
    await fetchData(selectYear)
  }

  function toggleYearList(event: Event) {
    // console.log(event)
    const yearList = document.querySelector('.year-list') as HTMLUListElement
    yearList.style.display == 'block' ? yearList.style.display = 'none' : yearList.style.display = 'block'
  }

  function fetchLastYear() {
    year.value -= 1;
    fetchStandings(103, year.value)
    fetchStandings(104, year.value)
  }

  function fetchNextYear() {
    year.value += 1;
    fetchStandings(103, year.value)
    fetchStandings(104, year.value)
  }

  onMounted(async () => {
    // await nextTick()
    next.value = document.querySelector('.next-year__button') as HTMLButtonElement
    last.value = document.querySelector('.last-year__button') as HTMLButtonElement
    if (year.value >= date.year) next.value.disabled = true
    if (year.value < 1876) last.value.disabled = true
    await fetchData()
  })

  // 다른 페이지에서 뒤로 가기 오는건 잘 되는데, 스탠딩 뷰 내에서 뒤로 가기는 정상작동이 안돼서 라우터를 다시 불러오기 해야됨
  watch(route, () => { router.go(0) })

  watch(year, () => {
    if (year.value >= date.year) next.value.disabled = true
    else next.value.disabled = false

    if (year.value < 1876) last.value.disabled = true
    else last.value.disabled = false
  })
</script>
<template>
  <div class="standings">
    <!-- 연도 이동 -->
    <div class="standings-year__dropdown">
      <span class="standings-year__dropdown-el">
        <button class="last-year__button" @click="fetchLastYear(), $router.push({ name: 'standings', query: { league: $route.query.league }, params: { season: year } })">이전</button>
        {{ year }}
        <button class="year-list__toggle-button" @click="(e) => toggleYearList(e)">보-탄</button>
        <ul class="year-list">
          <li v-for="(n, index) in (date.year - 1875)" :key="index" @click="changeYear(date.year - (n-1)), $router.push({ name: 'standings', query: { league: $route.query.league }, params: { season: year } })">
            {{ date.year - (n-1) }}
          </li>
        </ul>
        <button class="next-year__button" @click="fetchNextYear(), $router.push({ name: 'standings', query: { league: $route.query.league }, params: { season: year } })">다음</button>
      </span>
    </div>
    <!-- 리그 선택 -->
    <div class="standings-league__select">
      <span class="american" @click="$router.push({ name: 'standings', query: { league: 'AL' } })">{{ getTranslation(locale, 'al') }}</span> | 
      <span class="national" @click="$router.push({ name: 'standings', query: { league: 'NL' } })">{{ getTranslation(locale, 'nl') }}</span>
    </div>

    <!-- 순위 출력 -->
    <!-- render 전에 getStandings 불러오는 순서 에러 방지 -->
    <TheStandingsSkeletonLoader v-if="isLoadingStandings" />
    <div v-else class="standings-container">
      <!-- division에 따른 나눔 출력 위한 if문 설정 -->
      <!-- 1994~ added a third division -->
      <div v-if="getStandings[103] && getStandings[103][2]">
        <div v-if="($route.query.league == 'AL' || !$route.query.league)">
          <TheStandingsTable :standings="getStandings[103][0].teamRecords">
            <template #division>
              <div>{{ getTranslation(locale, 'ae') }}</div>
            </template>
          </TheStandingsTable>
      
          <TheStandingsTable :standings="getStandings[103][1].teamRecords">
            <template #division>
              <div>{{ getTranslation(locale, 'ac') }}</div>
            </template>
          </TheStandingsTable>
      
          <TheStandingsTable :standings="getStandings[103][2].teamRecords">
            <template #division>
              <div>{{ getTranslation(locale, 'aw') }}</div>
            </template>
          </TheStandingsTable>
        </div>
      
        <div v-if="$route.query.league == 'NL'">
          <TheStandingsTable :standings="getStandings[104][0].teamRecords">
            <template #division>
              <div>{{ getTranslation(locale, 'ne') }}</div>
            </template>
          </TheStandingsTable>
      
          <TheStandingsTable :standings="getStandings[104][1].teamRecords">
            <template #division>
              <div>{{ getTranslation(locale, 'nc') }}</div>
            </template>
          </TheStandingsTable>
      
          <TheStandingsTable :standings="getStandings[104][2].teamRecords">
            <template #division>
              <div>{{ getTranslation(locale, 'nw') }}</div>
            </template>
          </TheStandingsTable>
        </div>
      </div>
      <!-- 1969~ Divisional Era의 시작 -->
      <div v-else-if="getStandings[103] && getStandings[103][1]">
        <div v-if="($route.query.league == 'AL' || !$route.query.league)">
          <TheStandingsTable :standings="getStandings[103][0].teamRecords">
            <template #division>
              <div>{{ getTranslation(locale, 'ae') }}</div>
            </template>
          </TheStandingsTable>
      
          <TheStandingsTable :standings="getStandings[103][1].teamRecords">
            <template #division>
              <div>{{ getTranslation(locale, 'aw') }}</div>
            </template>
          </TheStandingsTable>
        </div>
      
        <div v-if="$route.query.league == 'NL'">
          <TheStandingsTable :standings="getStandings[104][0].teamRecords">
            <template #division>
              <div>{{ getTranslation(locale, 'ne') }}</div>
            </template>
          </TheStandingsTable>
      
          <TheStandingsTable :standings="getStandings[104][1].teamRecords">
            <template #division>
              <div>{{ getTranslation(locale, 'nw') }}</div>
            </template>
          </TheStandingsTable>
        </div>  
      </div>
      <!-- 1901~ MLB American league founded -->
      <div v-else-if="getStandings[103] && getStandings[103][0]">
        <div v-if="($route.query.league == 'AL' || !$route.query.league)">
          <TheStandingsTable :standings="getStandings[103][0].teamRecords">
            <template #division>
              <div>{{ getTranslation(locale, 'al') }}</div>
            </template>
          </TheStandingsTable>
        </div>
      
        <div v-if="$route.query.league == 'NL'">
          <TheStandingsTable :standings="getStandings[104][0].teamRecords">
            <template #division>
              <div>{{ getTranslation(locale, 'nl') }}</div>
            </template>
          </TheStandingsTable>
        </div>
      </div>
      <!-- 1876~ MLB National league founded -->
      <div v-else>
        <div v-if="$route.query.league == 'AL' || !$route.query.league">
          <p>{{ getTranslation(locale, 'foundedAmerican') }}</p>
        </div>
        <div v-if="$route.query.league == 'NL' && getStandings[104] && getStandings[104][0]">
          <TheStandingsTable :standings="getStandings[104][0].teamRecords">
            <template #division>
              <div>{{ getTranslation(locale, 'nl') }}</div>
            </template>
          </TheStandingsTable>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* 연도 드롭다운 설계 */
.standings-year__dropdown {
  display: flex;
  position: relative;
}

.standings-year__dropdown-el {
  position: relative;
  margin: 0 auto;
}

.standings-year__dropdown-el .year-list {
  display: none;
  position: absolute;
  margin: 0;
  padding: 0;
  width: 100px;
  height: 300px;
  top: 42px;
  left: calc(50% - 50px);
  list-style: none;
  overflow-y: scroll;
  z-index: 2;
  /* scrollbar-width: none; */
}

.standings-league__select {
  font-size: 1.2rem;
  cursor: pointer;
}
.standings-league__select .national:hover, .standings-league__select .american:hover {
  color: white;
  font-weight: bold;
  /* 상우하좌에 각각 그림자 적용/블러효과 x */
  /* offset-x | y | color */
  text-shadow: 0 -1px black, 1px 0 black, 0 1px black, -1px 0 black;
}
</style>