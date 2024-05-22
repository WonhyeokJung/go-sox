import RosterView from '@/views/rosters/RosterView.vue'
import RosterActive from '@/views/rosters/RosterActive.vue'
import RosterDepthChart from '@/views/rosters/RosterDepthChart.vue'
import Roster40man from '@/views/rosters/Roster40man.vue'
import RosterNonRoster from '@/views/rosters/RosterNonRoster.vue'

import { useDate, useProcessing } from '@/composables'
import { useRosterStore, useLoadingStore } from '@/stores'
import type { RouteLocationNormalized } from 'vue-router'
// import RosterCoaches from '@/views/rosters/RosterCoaches.vue'

const beforeEnter = async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: Function) => {
  let rosterType = ''
  const rosterStore = useRosterStore()
  const date = useDate()
  const { startProcessing } = useProcessing()
  const { startLoading, endLoading } = useLoadingStore()
  const { fetchDepthChart, fetchTeamRoster } = rosterStore

  // route.name의 타입에 에러 발생하여 as string으로 해결. 하지만 string이 아닐 어떤 가능성이라도 발견되면 런타임 에러가 발생한다.
  if (to.name as string == 'roster-depth-chart') rosterType = 'depthChart'
  else if (to.name as string == 'roster-40-man') rosterType = '40Man'
  else if (to.name as string == 'roster-non-roster') rosterType = 'nonRosterInvitees'
  else rosterType = 'active'

  if (await startProcessing(rosterType)) return;
  await startLoading()
  await fetchTeamRoster(date.today, rosterType)
  await fetchDepthChart(date.today, 'depthChart')
  await endLoading()
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
    // redirect: '/roster/active',
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