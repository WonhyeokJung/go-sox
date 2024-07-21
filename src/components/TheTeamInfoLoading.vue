<script setup lang="ts">
</script>
<template>
  <div>
    <div class="loading-container">
      <div class="loading"></div>
      <div class="loading-text"></div>
      <div class="loading-text__hover"></div>
    </div>
    <a class="loading-link" href="https://mlb.com/whitesox" title="whitesox.com">whitesox.com</a>
  </div>
</template>
<style scoped>
  .loading-link {
    display: block;
    margin-bottom: 30vh;
    color: #cccccc;
    font: 12px "YEONGJUSeonbiTTF", Menlo;
    text-align:center;
    text-decoration: none;
  }

  .loading-link:hover {
    color: #000;
  }

  .loading-link, .loading-link:hover {
    transition: color 0.5s ease-out;
    -webkit-transition: color 0.5s ease-out;
    -moz-transition: color 0.5s ease-out;
    -ms-transition: color 0.5s ease-out;
    -o-transition: color 0.5s ease-out;
  }

/** BEGIN CSS **/
  @keyframes rotate-loading {
      0%  {
        transform: rotate(0deg);
        -ms-transform: rotate(0deg); 
        -webkit-transform: rotate(0deg); 
        -o-transform: rotate(0deg); 
        -moz-transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
        -ms-transform: rotate(360deg); 
        -webkit-transform: rotate(360deg); 
        -o-transform: rotate(360deg); 
        -moz-transform: rotate(360deg);
      }
  }

  @keyframes loading-text-opacity {
      0%  { opacity: 0; }
      20% { opacity: 0; }
      50% { opacity: 1; }
      100%{ opacity: 0; }
  }
  
  @keyframes change-content {
    0% { content: 'Loading'; }
    100% { content: 'Go Sox!'; }
  }

  .loading-container,
  .loading {
      height: 100px;
      position: relative;
      width: 100px;
      border-radius: 100%;
  }


  .loading-container { 
    position: relative;
    margin: 30vh auto 2rem auto;
   }

  .loading {
      border: 2px solid transparent;
      /* border-color: transparent #fff transparent #FFF; */
      /* transparent(투명도) 지정으로 상하 border색을 투명하게 지정 */
      /* border-color: transparent #f4ce0d; */
      border-color: transparent #ccc;
      animation: rotate-loading 1.5s linear 0s infinite normal;
      -webkit-animation: rotate-loading 1.5s linear 0s infinite normal;
      -moz-animation: rotate-loading 1.5s linear 0s infinite normal;
      -o-animation: rotate-loading 1.5s linear 0s infinite normal;
      
      /* 
        동작이 일어날 기준점(default가 50%, 50%으로 정중앙이다.)이다. 0 0으로 하면 애니메이션이 좌측 상단을 기준점으로 작동한다.
        translate로 현재 위치기준에서 어디로 이동할지 선택도 가능하다. 
        animation, transition 모두 transfrom-origin을 동작 기준점으로 삼는다.
      */
      transform-origin: 50% 50%;
      -webkit-transform-origin: 50% 50%;
      -moz-transform-origin: 50% 50%;
      -o-transform-origin: 50% 50%;
  }

  /* hover시 border-color가 바뀜 */
  .loading-container:hover .loading {
      /* border-color: transparent #E45635; */
      border-color: transparent #000;
  }

  /* hover시 border-color 바뀌는 것에 정해진 시간으로 일어나게 함(가상 선택자에서 일어나는 일을 animation처럼 보이게 해줌) */
  .loading-container:hover .loading,
  .loading-container .loading {
    transition: border-color 0.5s ease-in-out;
    -webkit-transition: all 0.5s ease-in-out;
    -moz-transition: all 0.5s ease-in-out;
    -ms-transition: all 0.5s ease-in-out;
    -o-transition: all 0.5s ease-in-out;
  }

  /* 새로 추가 */
  .loading-text::after {
    content: 'loading';
    animation: loading-text-opacity 2s linear 0s infinite normal, change-content 4s linear 0s infinite normal;
  }
  /* 추가 끝 */

  .loading-text {
    position: absolute;
    top: 0;
    margin-top: 45px;
    width: 100px;
    /* animation: loading-text-opacity 2s linear 0s infinite normal;
    -webkit-animation: loading-text-opacity 2s linear 0s infinite normal;
    -moz-animation: loading-text-opacity 2s linear 0s infinite normal;
    -o-animation: loading-text-opacity 2s linear 0s infinite normal; */
    font-family: "YEONGJUSeonbiTTF", "Menlo";
    font-size: 10px;
    font-weight: bold;
    /* color: #4885ed; */
    color: #000;
    text-align: center;
    text-transform: uppercase;
  }
</style>