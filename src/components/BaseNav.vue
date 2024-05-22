<script setup lang="ts">
// import Navigation from '@/components/Navigation.vue'
defineProps<{
  locale: string,
  getTranslation: Function
}>()
</script>
<template>
  <div>
    <header class="site-header">
      <div class="site-header__container flex-wrapper">
        <a class="title"><img class="site-logo" src="../assets/go-sox-main.png" alt="Logo"></a>
        <p class="description">{{ getTranslation(locale, 'headerDescription') }}</p>
        <nav class="nav__router" style="clear: both;">
          <!-- dynamic routes -->
          <!-- <router-link :to="{ name: 'home', params: { playerId: '619933' }, query: { playerId: '619933' } }">홈</router-link> |  -->
          <router-link to="/">{{ getTranslation(locale, 'home') }}</router-link> | 
          <!-- 단순히 /active 이렇게 붙여도 일치하는 주소가 없다면, dynamic routes를 후순위로 인식함. -->
          <router-link to="/roster">{{ getTranslation(locale, 'roster') }}</router-link> | 
          <router-link to="/transactions">{{ getTranslation(locale, 'transactions') }}</router-link> | 
          <router-link to="/standings">{{ getTranslation(locale, 'standings') }}</router-link> |
          <router-link to="/schedule">{{ getTranslation(locale, 'schedule') }}</router-link>
          <!-- <Navigation /> -->
        </nav>
      </div>
    </header>
  </div>
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

.site-header__container .description {
  color: white;
}

.site-header__container .description p {
  margin: 0;
}

.site-header__container .nav__router {
  position: absolute;
  margin: 0 auto;
  width: 100%;
  /* width: 900px; */
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

@media (max-width: 568px) {
  .site-header__container {
    width: 100%;
  }
  .site-header__container .description {
    display: none;
  }
}
</style>