
<script setup lang="ts">
import { useLoadingStore } from '@/stores/'
import { storeToRefs } from 'pinia';

const { getIsLoading } = storeToRefs(useLoadingStore())
</script>

<template>
  <div class="lds-facebook" v-if="getIsLoading">
    <div></div>
    <div></div>
    <div></div>
  </div>
  <!-- 임시로 뒷배경 가리는 용 -->
  <div v-if="getIsLoading" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: white; z-index: 2"></div>
</template>

<style scoped>
.lds-facebook {
  display: inline-block;
  position: fixed;
  width: 64px;
  height: 64px;
  top: calc(50% - 32px);
  left: calc(50% - 32px);
  z-index: 3;
}
.lds-facebook div {
  display: inline-block;
  position: absolute;
  left: 6px;
  width: 13px;
  background: #42b883;
  animation: lds-facebook 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
}
.lds-facebook div:nth-child(1) {
  left: 6px;
  animation-delay: -0.24s;
}
.lds-facebook div:nth-child(2) {
  left: 26px;
  animation-delay: -0.12s;
}
.lds-facebook div:nth-child(3) {
  left: 45px;
  animation-delay: 0;
}
@keyframes lds-facebook {
  0% {
    top: 6px;
    height: 51px;
  }
  50%,
  100% {
    top: 19px;
    height: 26px;
  }
}
</style>
