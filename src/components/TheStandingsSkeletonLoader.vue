<script setup lang="ts">
</script>
<template>
  <div class="standings-skeleton-container" v-for="n in 3" :key="n">
    <div class="standings-skeleton-wrapper">
      <table class="skeleton__table">
        <thead>
          <tr>
            <th class="skeleton table__th" v-for="(team, index) in 8" :key="index"></th>
          </tr>
        </thead>
        <tbody v-for="(team, index) in 5" :key="index">
          <tr>
            <td class="skeleton table__td" v-for="(team, index) in 8" :key="index"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style scoped>
  /* margin과 height 순위표 테이블과 사이즈 맞게 직접 입력 */
  .standings-skeleton-container {
    margin-top: 37px;
    margin-bottom: 53px;
    width: 100%;
    height: 232px;
  }

  .skeleton__table {
    margin: 0 auto;
    /* width: 100%; */
    max-width: 1080px;
    border-collapse: collapse;
  }

  .skeleton__table .table__th {
    height: 40px;
    border-bottom: 0.5px solid gray;
  }

  .skeleton__table .table__td {
    height: 40px;
  }

  /* 첫번째(팀명)만 200px */
  .skeleton__table .table__th:nth-child(1),
  .skeleton__table .table__td:nth-child(1) {
    width: 200px;
  }

  /* 두번째 자식부터 전부 100px 적용 */
  .skeleton__table .table__th:nth-child(n+2),
  .skeleton__table .table__td:nth-child(n+2) {
    width: 100px;
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
    width: 70%;
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

  @media (max-width: 568px) {
    /* 5번째부터 모바일에선 출력 x */
    .skeleton__table .table__th:nth-child(n+5),
    .skeleton__table .table__td:nth-child(n+5) {
      display: none;
      width: 0;
    }

    /* 4번째 border-right 지우기 */
    .skeleton__table .table__th:nth-child(4),
    .skeleton__table .table__td:nth-child(4) {
      border-right: 0;
    }
  }
</style>