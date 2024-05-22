<script setup lang="ts">
  defineProps<{ 
    locale: string, 
    getTranslation: Function 
  }>()
</script>
<template>
  <div class="footer-container">
    <p>{{ getTranslation(locale, 'mlbamRule1') }}<a href="http://gdx.mlb.com/components/copyright.txt">{{ getTranslation(locale, 'copyright') }}</a>{{ getTranslation(locale, 'mlbamRule2') }}</p>
  </div>
</template>
<style scoped>
  .footer-container {
    margin-top: 2rem;
    border-top: 1px solid black;
    width: 100%;
    /* height: 200px; */
  }
</style>