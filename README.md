# GO-Sox

## File Tree

## 구현 과정과 회고

### vite.config.ts

1. 현재 서버환경에 따른 기본 주소 변경(배포/개발)
2. alias 및 tsconfig.json과 양동 설정을 통한 intellisense 설정
   두군데에만 해두었지만, 각종 폴더에 다 설정이 가능하다.

```typescript
/* @/vite.config.ts */
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

#### 로스터를 어떻게 저장할 것인가?

https://mlb.com의 로스터 항목을 살펴보면 Active, 40man 등 다양한 타입의 로스터를 볼 수 있는데 api에서도 이와 같이 각 로스터 별로 데이터를 불러오게 구성해 두었다. 이를 통해 처음 내가 구성했던 형태는 아래와 같다.

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

사용자 측에서 데이터를 최소한 적게 짜고 코드를 간단하게 짠다는 생각에 정말 기초적인 실수를 해버렸고, 사용자 쪽에서 데이터를 조금 더 저장해야 하더라도 각 로스터 타입 별로 데이터를 따로 저장해 주기로 했다..(특히 Depth Chart 불러올 때 데이터 호출이 너무 많이 늘어난다.)

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

## 성공하지 못한 작업

### components/Navigation.vue

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
