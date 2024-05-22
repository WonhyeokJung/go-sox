<script setup lang="ts">
</script>
<template>
  <div class="standings-skeleton-container">
    <div class="standings-skeleton-wrapper">
      <table class="skeleton__table">
        <colgroup>
          <col width="300px">
        </colgroup>
        <thead>
          <tr>
            <th class="skeleton table__th" v-for="(team, index) in 8" :key="index"></th>
          </tr>
        </thead>
        <tbody v-for="(team, index) in 15" :key="index">
          <tr>
            <td class="skeleton table__td" v-for="(team, index) in 8" :key="index"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style scoped>
  .standings-skeleton-container {
    width: 100%;
    height: 100%;
  }

  .skeleton__table {
    margin: 0 auto;
    width: 100%;
    max-width: 1080px;
    border-collapse: collapse;
  }

  .skeleton__table .table__th {
    border-bottom: 0.5px solid gray;
  }

  .skeleton__table .table__td:nth-child(1),
  .skeleton__table .table__td:nth-child(4),
  .skeleton__table .table__td:nth-child(6) {
    border-right: 0.5px solid gray;
  }

  /* 백그라운드 가로길이를 늘이고, 백그라운드 위치를 최우측으로 두고 애니메이션으로 제일 좌측에서 이동하게 해 로딩바처럼 표현 */
  .skeleton::after {
    content: '';
    display: block;
    margin: 0.4rem auto;
    width: 50%;
    height: 1rem;
    background: linear-gradient(120deg, #d7d3d3 20%, #cbc9cd 35%, #cbc9cd 40%, #d7d3d3 50%);
    background-size: 200% 100%;
    background-position: 100% 0;
    border-radius: 1rem;
    animation: load 1.5s infinite;
    /* animation: fadeout 3s forwards; */
  }

  /* .skeleton:hover::after {
    content: 'hovered!';
    background: black;
  } */

  @keyframes load {
    100% {
        background-position: -100% 0;
    }
  }

  @keyframes fadeout {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
</style>