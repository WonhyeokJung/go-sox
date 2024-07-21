# GO-Sox

## File Tree

## 구현 과정과 회고(시간순)

### vite.config.ts

1. 현재 서버환경에 따른 기본 주소 변경(배포/개발)
2. alias 및 tsconfig.json과 양동 설정을 통한 intellisense 설정
   두군데에만 해두었지만, 각종 폴더에 다 설정이 가능하다.

```typescript
/* @/vite.config.ts */
/* 필수 */
/* npm install --save-dev @types/node */
import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // mode에 따른 기본 route 변경(env 파일 설정)
    base: env.VITE_ASSET_PATH,
    // webpack에서 지원하는 alias 기능.
    // @로 root directory 가리키게 설정. tsconfig.json에도 설정해야 vscode에서 @/ 인식함.
    plugins: [vue()],
    resolve: {
      alias: [
        { find:'@', replacement: fileURLToPath(new URL('./src', import.meta.url))},
        // asset directory 가리키기.
        { find:'@assets', replacement: fileURLToPath(new URL('./src/assets', import.meta.url)) }
      ]
    },
  }
})

```

```typescript
// :root/.env.development
VITE_ASSET_PATH='/'

// :root/.env.production
VITE_ASSET_PATH='/dist/'
```



```json
/* :root/tsconfig.json */
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* vite.config.ts와 함께 절대경로 맵핑. eslint 있을 시, 에러나지않게 eslint에도 추가 */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@assets/*": ["./src/assets/*"],
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}

```





### Type 설정과 예시

1. api를 통해 받아올 데이터를 미리 확인하고(먼저 받아와보는 등) 그에 맞춰 타입을 분석해 상세하게 작성한다.
2. 이 작업이 없으면 나중에 컴포넌트에서 데이터를 불러올 때, property를 인식하지 못하는 등의 문제가 생길 수 있기 때문에 이 작업을 진행한다.

```typescript
<!-- api 통해 받아올 데이터의 타입 분석 후 상세 설정 -->
/** 
	'@/src/types/types.ts'
**/

interface LeagueInfo {
  copyright: string,
  divisions: Array<{
    id: number,
    name: string,
    season: string,
    nameShort: string,
    link: string,
    abbreviation: string,
    league: {
      id: number,
      link: string
    },
    sport: {
      id: string,
      link: string
    },
    hasWildcard: boolean,
    sortOrder: number,
    numPlayoffTeams: number,
    active: boolean
  }>,
}

export type {
  LeagueInfo
}
```

1. 설정한 타입에 맞게 변수/상수에 타입을 적용하고, 데이터를 받아서 대입한다. 
2. Ref 같은 경우는 Ref를 타입 설정을 위한 내장 타입을 import한 후, 내가 임의로 설정한 타입을 추가 적용시키는 방법을 사용한다.

```ts
/** '@/src/stores/index.ts' **/
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { $_getLeagueInfo } from '@/api/get.ts'
<!-- 그냥 import { Ref } from 'vue'도 가능하다. -->
import type { Ref } from 'vue'
import type { LeagueInfo } from '@/types'

export const useIndexStore = defineStore('index', () => {
  <!-- type관한 충돌이 일어나지 않게 types.ts에 지정한 형식대로 기본 형식을 지정해준다. -->
  const leagueInfo: Ref<LeagueInfo> = ref({ copyright: '', divisions: [] })
  const getLeagueInfo = computed<LeagueInfo>(() => leagueInfo.value)

  async function fetchLeagueData() {
    const { data } = await $_getLeagueInfo()
    leagueInfo.value = data;
  }

  return {
    leagueInfo,
    getLeagueInfo,
    fetchLeagueData
  }
})
```

```vue
<script setup lang="ts">
  // Vue Page
import { Ref, onMounted, ref } from 'vue'
import { useIndexStore } from '@/stores'
import { storeToRefs } from 'pinia';

defineProps<{ msg: string }>()
const count: Ref<number> = ref(0)
const indexStore = useIndexStore();

const { leagueInfo, getLeagueInfo } = storeToRefs(indexStore)
const { fetchLeagueData } = indexStore;

onMounted(() => {
  fetchLeagueData();
})
</script>

<template>
  <!-- <p>{{ leagueInfo }}</p> -->
	<!-- 위에서 한 설정이 없다면, 여기서 copyright를 object의 property로 인식하지 못해 아래와 같은 에러가 발생한다.-->
	<!-- Property 'copyright' does not exist on type 'Object'.ts-plugin(2339) -->
  <p>{{ getLeagueInfo.copyright }}</p>
</template>

<style scoped>
</style>

```



### Index Signature(Object가 Variable을 Key 값으로 받아들이지 못한다?)



### views/rosters/

#### 로스터를 언제 불러올 것인가?

처음 설계할 때에는 당연하게도

1.  `onMounted(() => {})` 에서 첫 마운트 시에 데이터를 받아오게 한다.
2. 이후 `nav-link`를 클릭할 때마다 데이터가 없으면 데이터를 받아오고, 있으면 데이터를 받아오지 않고 기존 데이터를 계속 사용한다.

```vue
<script setup lang="ts">
  // 'roster/RosterView.vue'
	// { ... }
  // onclick시 순서 위해서 async/await 적용
  async function onClickRosterLink(date:string, type:string) {
    // 엄청 빠르게 클릭시 중복 호출 방지
    rosterType.value = type;
    if (await startProcessing(rosterType.value)) return;
    await fetchTeamRoster(date, rosterType.value)
    if (rosterType.value === 'depthChart') await fetchDepthChart(date, rosterType.value)
    await endProcessing(rosterType.value)
  }
  
  onMounted(async () => {
    await router.isReady();
    // route.name의 타입에 에러 발생하여 as string으로 해결. 하지만 string이 아닐 어떤 가능성이라도 발견되면 런타임 에러가 발생한다.
    if (route.name as string == 'roster-depth-chart') rosterType.value = 'depthChart'
    else if (route.name as string == 'roster-40-man') rosterType.value = '40Man'
    else if (route.name as string == 'roster-non-roster') rosterType.value = 'nonRosterInvitees'
    else rosterType.value = 'active'

    // Team Roster 불러온 후, 뎁스차트까지 미리 불러온다.
    await fetchTeamRoster(useDate(), rosterType.value)
    // 위에서 가져온 데이터가 depth chart가 아니면 or depthChart 객체가 이미 차 있으면 불러오지 않게 뒷단 처리 완료
    await fetchDepthChart(useDate(), 'depthChart')
  })
</script>

<template>
  <div class="roster-view">
    <h1>Roster</h1>
    <nav>
      <!-- SPA에 새로고침 적용이 맞을까..? -->
      <router-link to="/roster" @click.once="onClickRosterLink(date, 'active')">액티브(26-28인 로스터)</router-link> | 
      <router-link to="/roster/depth-chart" @click="onClickRosterLink(date, 'depthChart')">뎁스차트</router-link> | 
      <router-link to="/roster/40-man" @click="onClickRosterLink(date, '40Man')">40인 로스터</router-link> | 
      <router-link to="/roster/non-roster" @click="onClickRosterLink(date, 'nonRosterInvitees')">non-roster invitees</router-link> | 
    </nav>
    <router-view />
  </div>
</template>
```

구조를 이렇게 설계하고 보니 드는 의문점이 몇가지 있었는데,

1. onMounted를 이용하더라도 composables를 이용해 로딩 중에는 로딩 중임을 보여주는 화면을 보여줄 수 있어 구조상 문제는 없지만, App.vue에 연결되어 있는 로딩 중 페이지의 실행 여부를 굳이 App.vue의 하위 컴포넌트의 onMounted에서 보여줘야 할까?
2. 컴포넌트가 마운트되고 나서 데이터를 불러오는 것보다, 데이터를 불러오는 api를 먼저 호출하고, 그 후 동시에 컴포넌트를 마운트 시킨다면(어차피 컴포넌트는 데이터가 있어야 컴포넌트 내에 데이터를 투입할 수 있으니까) 조금이라도 결과가 빨라지고, 구조상으로도 더 맞는 설계 아닐까?
3. 이렇게 되면 굳이 `onClickRosterLink`같은 임의의 함수를 추가하지 않아도 되어 함수도 하나 줄어드는 효과도 있다.

그래서 `router`에서 `beforeEnter`를 사용해서 처음에 불러오는 데이터를 투입시키기로 했다. **async/await를 사용했기 때문에, 데이터가 다 불러와지기 전까지는 화면이 마운트되지 않는다.** 이것은 로딩 중에 보여줄 페이지를 구현해서 보완하면 된다.

```typescript
// src/router/roster.ts
// Router Components
import RosterView from '@/views/rosters/RosterView.vue'
import RosterActive from '@/views/rosters/RosterActive.vue'
import RosterDepthChart from '@/views/rosters/RosterDepthChart.vue'
import Roster40man from '@/views/rosters/Roster40man.vue'
import RosterNonRoster from '@/views/rosters/RosterNonRoster.vue'
// type, stores and composables
import { useDate, useProcessing } from '@/composables'
import { useRosterStore } from '@/stores'
import type { RouteLocationNormalized } from 'vue-router'
// beforeEnter Function
const beforeEnter = async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: Function) => {
  let rosterType = '' // rosterType은 함수 내에서만 쓸 것이므로 살아있을 필요가 없다.
  const rosterStore = useRosterStore()
  const { startProcessing } = useProcessing()
  const { fetchDepthChart, fetchTeamRoster } = rosterStore

  if (to.name as string == 'roster-depth-chart') rosterType = 'depthChart'
  else if (to.name as string == 'roster-40-man') rosterType = '40Man'
  else if (to.name as string == 'roster-non-roster') rosterType = 'nonRosterInvitees'
  else rosterType = 'active'

  if (await startProcessing(rosterType)) return;
  await fetchTeamRoster(useDate(), rosterType)
  await fetchDepthChart(useDate(), 'depthChart')
  await next()
}

export default [
  {
    path: '/roster',
    // 아래처럼 path:'' 가 있는 경우 일반적으로 자식만 이름을 준다.
    // name: 'roster',
    component: RosterView,
    // lazy-load
    // component: () => import('@/views/rosters/RosterView.vue'),
    // beforeEnter: beforeEnter,
    children: [
      // /roster, RosterView에 router-view가 있으면 거기에 RosterActive를 띄운다.
      { path: '', name: 'roster', component: RosterActive, beforeEnter: beforeEnter, meta: { rosterType: 'active' } },
      { path: 'depth-chart', name: 'roster-depth-chart', component: RosterDepthChart, beforeEnter: beforeEnter, meta: { rosterType: 'depthChart' } },
      // /roster/40-man
      { path: '40-man', name: 'roster-40-man', component: Roster40man, beforeEnter: beforeEnter, meta: { rosterType: '40Man' } },
      { path: 'non-roster', name: 'roster-non-roster', component: RosterNonRoster, beforeEnter: beforeEnter, meta: { rosterType: 'nonRosterInvitees' } },
    ]
  }
]
```



로스터 특성상 단시간에 급변하지 않으므로 한번 불러와서 내 세션/로컬 내에 데이터가 살아있으면 데이터를 다시 불러오지 않게 막는 로직으로 데이터 중복 호출을 방지해두어, 이후 화면에서 `nav-link`를 통해 다른 타입의 로스터를 불러오더라도 호출이 두 번 일어나지는 않는다.

#### 로스터를 어떻게 저장할 것인가?

https://mlb.com의 로스터 항목을 살펴보면 Active, 40man 등 다양한 타입의 로스터를 볼 수 있는데 api에서도 이와 같이 각 로스터 별로 데이터를 불러오게 구성해 두었다. 이를 통해 처음 내가 구성했던 형태는 아래와 같다.

- 데이터를 받아올 때마다 저장하는 state를 초기화하고 다시 대입한다.

```typescript
/**
	1. api/get.ts -> 오늘 날짜 기준으로, 각 타입의 데이터를 불러온다.
**/
function $_getTeamRoster(date:string=useDate(), rosterType:string='active') {
  return axios.get(`${BASE_URL}api/v1/teams/145/roster?date=${date}&rosterType=${rosterType}`)
}
```

```typescript
/**
	2. stores/roster.ts -> fetchTeamRoster를 통해 받아온 데이터를 저장해서 사용한다.
**/

export const useRosterStore = defineStore('roster', () => {
  // stats
  // teamRoster는 새로운 데이터가 들어올 때마다 .length = 0으로 초기화되고 다시 데이터를 저장한다.
  let teamRoster: Array<Roster> = reactive([])
  
  // getters
  const getTeamRoster = computed<Array<Roster>>(() => teamRoster)

  // actions
  async function fetchTeamRoster(date:string, rosterType:string) {
    try {
      const { data } = await $_getTeamRoster(date, rosterType)
      // !! teamRoster = [] 하면 기존 배열 참조 끊어져서 못불러옴 !!
      if (teamRoster) teamRoster.length = 0;

      for (const player of data.roster) {
        await playerStore().fetchPlayer(player.person.link)
        player.personalInfo = playerStore().getPlayer.people[0]
        teamRoster.push(player)
      }
    } catch(err) {
      console.error(err)
    }
  }

  return {
    teamRoster,
    getTeamRoster,
    fetchTeamRoster
  }
})
```

위 과정에서 생긴 변수가 있는데,

1. 이용자가 돌아가면서 여러 로스터를 동시 확인하면 계속 데이터를 요청하게 된다.
2. 기존 데이터가 저장되어 있지 않고 계속 새로 덮어씌우다 보니 계속 데이터를 호출하며 자원이 낭비된다.

사용자 측에서 데이터를 최소한 적게 짜고 코드를 간단하게 짠다는 생각에 정말 기초적인 실수를 해버렸고, 사용자 쪽에서 데이터를 조금 더 저장해야 하더라도 **각 로스터 타입 별로 데이터를 따로 저장**해 주기로 했다..(특히 Depth Chart 불러올 때 데이터 호출이 너무 많이 늘어난다.)

\+이에 더해서, 가져오는 데이터의 양 자체가 많지 않기 때문에 처음부터 모든 타입의 데이터를 한번에 가져오고 가져오는 동안 로딩 페이지를 보여주는 것이 더 경제적이며, 사용자 입장에서 더 보기 편한 구조라는 결론에 데이터를 한번에 전부 불러오는 방식으로 변경했다.

이는 선수별 개인정보를 따로 보관하는 상황에서 기인하는데, 좌투/우투 같은 기본정보들이 각 선수별 페이지에 들어가 있어 이를 출력하기 위해서는 **타입별 로스터를 가져온 후, 그 안에 있는 선수별 링크를 활용해 선수 링크를 한번 더 가져와야** 한다. 그래서, 처음부터 타입별 로스터를 불러올 때 선수별 링크를 이용해 선수 정보도 불러오고 \+ 이를 선수별로 먼저 저장해두는 것이 사용자 입장에서 더 빠른 웹사이트 이용 방식으로 느껴질 것이라는 판단 하에 구조를 이와 같이 설정했다.

```typescript
interface Roster {
  person: {
    id: number,
    fullName: string,
    link: string
  },
  jerseyNumber: string,
  position: {
    code: string,
    name: string,
    type: string,
    abbreviation: string
  },
  status: {
    code: string,
    description: string
  },
  parentTeamId: number,
  // api에서 보내온 데이터 객체에 personalInfo라는 객체를 임의로 추가하여, 선수 링크에 담긴 정보를 투입할 것이다.
  personalInfo: PersonalInfo | null, // @/types/personalInfo.ts
}
```

잘 짜여진 api 데이터를 최소한의 자원으로 잘 활용하는 일은 생각보다 정말 어렵다...



### Provide, Inject와 router의 meta

기존에는 provide, inject를 통해 멀리 떨어져 있는 컴포넌트에 데이터를 전달했었다. 하지만 위의 [로스터를 언제 불러올 것인가?](#로스터를-언제-불러올-것인가?)에서 데이터를 화면을 마운트하기 전인 router의 beforeEnter로 옮기면서, **오직 `setup`내에서만 사용한 `provide()`를 사용할 수 없게** 되었다.

```vue
/** 보내는 컴포넌트 **/
<script setup>
	import { provide, ref } from 'vue'
  
  const temp = ref('');
  provide('something', temp.value)
</script>

/** 받아올 어딘가의 컴포넌트 **/
<script setup>
	import { inject } from 'vue'
  const something = inject('something')
</script>
```

vue-router의 각 route는 `meta`라는 키값을 이용하여 임의의 값을 넣어줄 수 있는데, 이를 이용하여 이 문제를 해결하였다.

```typescript
// router/roster.ts
// meta에 rosterType이라는 임의의 key를 넣어주었다.
export default [
  {
    path: '/roster',
    component: RosterView,
    children: [
      { path: '', name: 'roster', component: RosterActive, beforeEnter: beforeEnter, meta: { rosterType: 'active' } },
      { path: 'depth-chart', name: 'roster-depth-chart', component: RosterDepthChart, beforeEnter: beforeEnter, meta: { rosterType: 'depthChart' } },
      { path: '40-man', name: 'roster-40-man', component: Roster40man, beforeEnter: beforeEnter, meta: { rosterType: '40Man' } },
      { path: 'non-roster', name: 'roster-non-roster', component: RosterNonRoster, beforeEnter: beforeEnter, meta: { rosterType: 'nonRosterInvitees' } },
    ]
  }
]

// 받아올 Vue 컴포넌트
// <script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
const rosterType = route.meta.rosterType
// </script>
```

### 모바일에서 구동하기(네트워크 연결식)

`localhost`에서 작업중일때 일반적으로 모바일 상으로 접속하려면 같은 와이파이 내에서 작업을 해야 하는데, 같은 와이파이 내에서 작업을 하더라도 아이폰 상에서 접속이 불가능한 문제가 있어  네트워크 연결을 오픈하는 아래의 과정을 추가해주었다.

```json
// package.json
{
  ...
  "scripts": {
    // 기존 vite에서 --host를 추가해준다.
    // "dev": "vite"
    "dev": "vite --host",
    "build": "vue-tsc && vite build",
    "preview": "vite preview"
  },
}
```

```bash
# bash
$ npm run dev
> APP_NAME@0.0.0 dev
> vite --host
  VITE v5.1.5  ready in 156 ms
  ➜  Local:   http://localhost:5173/
  # 원래는 Network로는 열리지 않는다.
  ➜  Network: http://IP_ADDRESS:5173/ # --host 명령어를 추가해줌으로써, ip address를 이용한 네트워크 접속 허용
```

접속은 `http://[IP_ADDRESS]:[PORT_NUMBER]`이다.

### Div 밖으로 나가는 text

statsapi에서 자료를 가져오는 중에 `<div>`밖으로 text가 새어나가는 현상을 모바일 환경에서 발견하여 css상으로 줄바꿈을 강제하여 해결했다.

```css
html, body {
  word-break: break-all; /* break-word로 단어별 줄바꿈도 가능하다. */
}
```

### 중앙정렬을 벗어난 TheSpinner

모바일 작업 중 Spinner가 중앙이 아닌 우측 하단에 치우쳐 있는 것을 발견하여 css를 수정했다.

```css
/* before */
.class {
  display: inline-block;
  position: fixed;
  width: 64px;
  height: 64px;
  top: 47%;
  left: 47%;
}
/* after */
.class {
  display: inline-block;
  position: fixed;
  width: 64px;
  height: 64px;
  /* width, height의 절반만큼 빼기 */
  top: calc(50% - 32px);
  left: calc(50% - 32px);
}
```

### z-index 설계

| 선순위(높을수록) | 대상                    | 이유                                                    |
| ---------------- | ----------------------- | ------------------------------------------------------- |
| 5                | header                  | 항상 보여야됨                                           |
| 4                | View page nav           | 페이지 속 nav를 클릭 후 nav가 사라지는 것은 이상함      |
| 3                | Spinner Component       | 로딩 화면이기 때문                                      |
| 2                | Spinner background      | 스피너는 보여주고 뒷화면은 숨겨야됨                     |
|                  | standings year selector | 연도 선택자 클릭이 우선이기 때문에 2로 상향조정         |
| -1               | Standings td table      | mobile scroll시 sticky el 좌측에 미세하게 글자가 출력됨 |



### Suspense의 적용

Vue3에서 실험 단계에 있는 내장 컴포넌트로, 비동기 의존성이 해결될 때까지 로드 상태를 렌더링하기 위해 고안된 컴포넌트이다.
Vue가 가지고 있는 단점 중 하나가, HTML 컴포넌트 렌더링이 비동기 컴포넌트를 불러오기 전에 실행되어 콘솔 상 에러를 일으키는 것인데, 예를 들어 API를 통해 MLB 사이트에서 리그 데이터 Object를 가져온 후 이를 HTML에서 보간법으로 데이터를 바인딩하게 되면 **Vue가 Object의 key값을 읽어들이지 못해** 에러가 발생하는 경우가 생긴다.

이를 해결하기 위해 보통 사용하는 방법은 **`v-if`**였다.

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { useLeagueStore } from '@/stores'
import { storeToRefs } from 'pinia';
const leagueStore = useLeagueStore()

const { getLeagueInfo } = storeToRefs(leagueStore)
const { fetchLeagueData } = leagueStore

// onMounted + v-if(v-if가 없으면 에러 + 화면 출력도 안되어 v-if가 필수이다.) 혹은,
onMounted(async () => {
  await fetchLeagueData()
});

// 즉시실행함수(IIFE)로 해결한다.(화면은 출력되지만, 에러는 여전히 나서 비추천)
(async () => {
 await fetchLeagueData()
})()
</script>

<template>
	<!-- 에러를 방지하기 위한 v-if 투입 -->
  <div v-if="getLeagueInfo.leagues && getLeagueInfo.leagues[0]">
    <!-- Key값을 찾지 못하는 Uncaught Error가 console에 발생한다. -->
    {{ getLeagueInfo.leagues[0].name }}
  </div>
</template>
```

Vue3의 setup은 과거 Vue2의 **Created**와 같은 역할을 하는데, 과거의 created와 다른 점은 **setup 내에선 await 함수의 사용이 불가능**하다는 점이다(그래서 보통 onMounted를 이용하거나, 즉시실행함수를 사용하게 된다.). 하지만 Suspense를 이용해 비동기 의존성의 해결을 먼저 기다리게 하면, Vue3의 **setup에서 async/await의 사용이 가능**해진다. 이를 통해 `v-if`의 잦은 사용도 방지할 수 있고(데이터가 다 들어온 후 화면이 렌더링 되기 때문), **하위 컴포넌트들의 로딩/에러 작업을 각각이 아닌 상위 컴포넌트에서 한번에 처리가 가능**해진다.

```
<Suspense>
└─ <Main>
   ├─ <Child1>
   │  └─ <Team> (비동기 setup()과 컴포넌트)
   └─ <Child2>
      ├─ <Scores> (비동기 컴포넌트)
      └─ <PlayerStats> (비동기 컴포넌트)
```

하위 컴포넌트 3가지의 비동기 작업 순서는 전부 다른데, 이를 로딩 3개로 표현하지 않고 최상위 컴포넌트에서 한번에 모든 로딩이 끝나는 것을 기다리면서 로딩/에러 화면을 제어할 수 있다.

```vue
<!-- Parents.vue -->
<script setup lang="ts">
	  
</script>
<template>
	<Suspense>
    <!-- 메인 컨텐츠(출력하려는 비동기 의존성을 보유한 컴포넌트) -->
    <Main />
    <!-- Suspense 내 Template을 이용해 비동기 의존성 해결 중 보여줄 로딩화면을 제어한다. -->
    <template #fallback>
      로딩중... <!-- 로딩용으로 만든 컴포넌트를 가져다 써도 된다. -->
    <template>
  </Suspense>
</template>
```

Main 컴포넌트에서는 이제 onMounted로 비동기 작업 후 v-if로 출력할 필요없이, setup 내에 직접 await를 사용해서 호출할 수 있다.

```vue
<script setup lang="ts">
import { useLeagueStore } from '@/stores'
import { storeToRefs } from 'pinia';
const leagueStore = useLeagueStore()

const { getLeagueInfo } = storeToRefs(leagueStore)
const { fetchLeagueData } = leagueStore

// 550k에 달하는 import { onMounted } from 'vue'를 사용하지 않아도 된다.
await fetchLeagueData()
</script>

<template>
	<!-- v-if 역시 필요없다. -->
  <div>
    {{ getLeagueInfo.leagues[0].name }}
  </div>
</template>
```

로딩 제어가 아주 간편하게 가능하지만, 보통 `<KeepAlive>`, `<Transition>`과 함께 쓰는 점, 그리고 아직 개발중이라는 단점 때문에 전체 적용은 피하기로 결정했다.

## 성공하지 못한 작업

### components/Navigation.vue

### 컴포넌트 로딩 속도(ScheduleView)



## 결과



## 애먹었던 부분

### 배열의 참조값 문제(const teamRoster = [])

여러 로스터(Active, 40man) 등을 불러올 때 하나의 배열에 계속 다른 값을 대입하면서, 기존의 배열을 초기화하지 않으면 데이터가 계속 쌓이는 문제가 생겨 데이터가 있으면 데이터를 지우고자 만든 코드가 바로 아래 코드였는데,

```typescript
if(teamRoster) teamRoster = [];
```

이 방식을 사용하자 의도한대로 데이터를 검색할 수가 없었다. 그 이유는 단순했는데, 저렇게 새로운 **배열을 할당**하면 아예 새로운 배열에 참조값을 연결시키기 때문이었다. 해결 방법은 아래와 같다.

```javascript
if (teamRoster) teamRoster.length = 0; // 길이를 0으로 하면 배열 내부의 값만 초기화된다.
```



## 구현 예정

### localStorage, sessionStorage(종료시 세션만료로 사라짐) 이용해서 데이터 중복 호출 방지

- localStorage, sessionStorage에 데이터 저장 후, 데이터가 확인되면 중복 호출 방지하고 그 데이터 불러와 적용
- 로스터는 매일 바뀌는 민감한 부분이므로 localStorage를 통해 저장해두면 난감해진다. 저장한 날짜를 확인할 방법을 찾아야할듯

## 간단 컨벤션

### 디렉토리

- 디렉토리(폴더)명은 kebab-case로 한다.

### Vue

- vue 파일명은 모두 파스칼케이스로 한다.
- 여러 곳에 쓰이는 컴포넌트의 default 형태는 파스칼케이스로 `Base~`로 시작하는 명칭으로 작성한다.
- 특정한 곳에 쓰이는 컴포넌트는 `The~`로 명명하고, 역시 파스칼케이스를 사용한다.

### CSS

기본적으로 `BEM`네이밍 컨벤션을 따른다.

기본 규칙은 css를 정의할 때, **태그명 혹은 ID는 절대 사용하지 않는 것**이지만, 상위 컴포넌트의 네이밍이 아주 특정해진 경우 예외로 두고 태그명을 사용하기로 한다.

#### class명

- 단어 사이의 연결은 `-`(하이픈)을 이용한다.

- 특정 클래스의 하위 요소(element)를 표기할 때는 `__`(더블 언더스코어)를 이용한다.

  `.main-table__cell`

  `.main-nav__element`

- 특정 기능(수정자, Modifier)를 표기할 때는 `--`(더블 하이픈)을 사용한다.

  `.main-nav__item--vertical-align`

- 클래스명이 너무 길어지는 것을 방지하기 위해, table처럼 하위에 들어오는 엘레먼트를 명확하게 지정해서 사용할 수 있으면 css 상에서 지정하는 식으로 사용한다.(개인적인 판단이 많이 작용하는 부분이므로 되도록 이용은 지양한다.)

  - Good

    `.roster-table .nationality {}`

  - Bad

    `.roster-table__nationality {}`



## 출처 및 저작권(Source and Copyright)

| 이름/설명(Name/Description)                                  | 출처/저작권(Source/Copyright)                                |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| MLB Datas from MLB Statsapi                                  | <a href="https://gdx.mlb.com/components/copyright.txt">MLB Statsapi Copyright</a> |
| South Korea Icon from <a href="https://media.flaticon.com/license/license.pdf?_ga=2.30653503.1613695917.1715231676-1130482169.1715231676&_gl=1*12ei3nk*test_ga*MTEzMDQ4MjE2OS4xNzE1MjMxNjc2*test_ga_523JXC6VL7*MTcxNTIzMTY3Ni4xLjEuMTcxNTIzMjA1MC4xNi4wLjA.*fp_ga*MTEzMDQ4MjE2OS4xNzE1MjMxNjc2*fp_ga_1ZY8468CQB*MTcxNTIzMTY3Ni4xLjEuMTcxNTIzMjA1MC4xNi4wLjA.">Flaticon</a> | <a href="https://www.flaticon.com/free-icons/south-korea" title="south-korea icons">South-korea icons created by Freepik - Flaticon</a> |
| USA Icon from <a href="https://media.flaticon.com/license/license.pdf?_ga=2.30653503.1613695917.1715231676-1130482169.1715231676&_gl=1*12ei3nk*test_ga*MTEzMDQ4MjE2OS4xNzE1MjMxNjc2*test_ga_523JXC6VL7*MTcxNTIzMTY3Ni4xLjEuMTcxNTIzMjA1MC4xNi4wLjA.*fp_ga*MTEzMDQ4MjE2OS4xNzE1MjMxNjc2*fp_ga_1ZY8468CQB*MTcxNTIzMTY3Ni4xLjEuMTcxNTIzMjA1MC4xNi4wLjA.">Flaticon</a> | <a href="https://www.flaticon.com/free-icons/united-states" title="united states icons">United states icons created by CorelisOP - Flaticon</a> |
|                                                              |                                                              |

![image-20240509002219576](/Users/won/Library/Application Support/typora-user-images/image-20240509002219576.png)
