<script setup lang="ts">
import TheTeamInfo from '@/components/TheTeamInfo.vue'
import TheTeamInfoLoading from '@/components/TheTeamInfoLoading.vue';

defineProps(['locale', 'getTranslation'])
</script>
<template>
  <Suspense>
    <TheTeamInfo :locale="locale" :getTranslation="getTranslation" />
    <template #fallback>
      <TheTeamInfoLoading />
    </template>
  </Suspense>
</template>