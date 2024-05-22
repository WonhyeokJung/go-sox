<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useTransactionsStore } from '@/stores'
  import { storeToRefs } from 'pinia';
  
  defineProps<{ locale:string, getTranslation: Function }>()

  const transactionsStore = useTransactionsStore()
  const { getTransactions } = storeToRefs(transactionsStore)
  const { fetchTransactions }= transactionsStore

  onMounted(async () => {
    await fetchTransactions(145)
  })
</script>
<template>
  <h1>{{ getTranslation(locale, 'todaySoxTransactions') }}</h1>
  <div v-if="getTransactions && getTransactions!.transactions.length">
    <div v-for="(el, idx) in getTransactions!.transactions" :key="idx">
      <!-- API 문제인지 fullName 불러올 때 에러남 -->
      <!-- <p>{{ el.person.fullName }}</p> -->
      <p>{{ el.typeDesc }}</p>
      <p>{{ el.description }}</p>
    </div>
  </div>
  <div v-else>
    <h2>{{ getTranslation(locale, 'noTransactions') }}</h2>
  </div>
</template>
<style scoped>
  
</style>