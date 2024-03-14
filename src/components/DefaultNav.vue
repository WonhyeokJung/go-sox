<script setup lang="ts">
  // import Navigation from '@/components/Navigation.vue'
</script>
<template>
  <header class="site-header">
    <div class="container flex-wrapper">
      <a class="site-title"><img class="site-logo" src="../assets/go-sox-main.png" alt="Logo"></a>
      <p style="color: white;">Chicago White Sox fan page</p>
      <nav class="site-nav" style="clear: both;">
        <!-- dynamic routes -->
        <!-- <router-link :to="{ name: 'home', params: { playerId: '619933' }, query: { playerId: '619933' } }">홈</router-link> |  -->
        <router-link to="/">홈</router-link> | 
        <!-- 단순히 /active 이렇게 붙여도 일치하는 주소가 없다면, dynamic routes를 후순위로 인식함. -->
        <router-link to="/roster">로스터</router-link>
        <!-- <router-link :to="{ name: 'roster', params: { rosterType: 'active' } }">로스터</router-link> -->
        <!-- <Navigation /> -->
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background: #000000;
  z-index: 5;
}

.site-title {
  margin: 0;
  z-index: 5;
}

.site-nav {
  position: absolute;
  margin: 0 auto;
  width: 100%;
}

.site-logo {
  width: 4rem;
  height: 4rem;
}

.site-logo:hover {
  cursor: pointer;
}

.site-name:hover {
  /* filter: drop-shadow(0 0 2em #646cffaa); */
}
</style>