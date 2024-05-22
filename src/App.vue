<script setup lang="ts">
import BaseNav from '@/components/BaseNav.vue'
import TheSpinner from '@/components/TheSpinner.vue'
import TheFooter from '@/components/TheFooter.vue'
import { useLocaleStore, useTranslationStore } from './stores';
import { storeToRefs } from 'pinia';
import { onBeforeMount } from 'vue';

// standings button 눌렀을 때 나오는 yearList 바깥쪽 클릭했을때도 사라지도록 제어
function handleDisplay(event: Event) {
  const target = event.target
  const yearList = document.querySelector('.year-list') as HTMLUListElement
  const yearListToggleButton = document.querySelector('.year-list__toggle-button')
  if ((target && yearList && yearListToggleButton) && target != yearList && target != yearListToggleButton) yearList.style.display = 'none'
  return
}

const localeStore = useLocaleStore()
const translationStore = useTranslationStore()
const { getLocale } = storeToRefs(localeStore)
const { updateLocale } = localeStore
const { getTranslation } = storeToRefs(translationStore)

onBeforeMount(() => {
  translationStore.fetchTranslation()
})
</script>

<template>
  <!-- 모달 등 제거 위해 겉 div로 씌워 이벤트 작성 -->
  <div @click="handleDisplay">
    <!-- import 중복 방지 위해 번역 결과와 선택 언어를 App.vue에서 배포 -->
    <BaseNav :locale="getLocale" :getTranslation="getTranslation" />
    <TheSpinner />
    <div class="language">
      <span class="language-icon-wrapper">
        <img class="language-icon" src="@/assets/South_Korea_Icon_From_Flaticon.png" alt="ko-KR" @click="updateLocale('ko-KR')">
      </span>
      <span class="language-icon-wrapper">
        <img class="language-icon"src="@/assets/USA_Icon_From_Flaticon.png" alt="en-US" @click="updateLocale('en-US')">
      </span>
    </div>
    <router-view :locale="getLocale" :getTranslation="getTranslation" />
    <TheFooter :locale="getLocale" :getTranslation="getTranslation" />
  </div>
</template>

<style scoped>
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

.language {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 6;
}

.language-icon-wrapper {
  padding: 0 0.5rem;
}

.language-icon {
  width: 2rem;
  height: 2rem;
}

.language-icon:hover {
  cursor: pointer;
}

@media (max-width: 568px) {
  .language-icon {
    width: 1.5rem;
    height: 1.5rem;
  }
}
</style>
