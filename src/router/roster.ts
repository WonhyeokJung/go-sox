import RosterView from '@/views/rosters/RosterView.vue'
import RosterActive from '@/views/rosters/RosterActive.vue'
import RosterDepthChart from '@/views/rosters/RosterDepthChart.vue'
import Roster40man from '@/views/rosters/Roster40man.vue'
import RosterNonRoster from '@/views/rosters/RosterNonRoster.vue'
import type { RouteLocationNormalized } from 'vue-router'

const beforeEnter = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: Function) => {
  console.log(to, from, next)
  next()
}

export default [
  {
    path: '/roster',
    // 아래처럼 path:'' 가 있는 경우 일반적으로 자식만 이름을 준다.
    // name: 'roster',
    component: RosterView,
    // beforeEnter: beforeEnter,
    children: [
      // /roster, RosterView에 router-view가 있으면 거기에 RosterActive를 띄운다.
      { path: '', name: 'roster', component: RosterActive, beforeEnter: beforeEnter },
      { path: 'depth-chart', name: 'roster-depth-chart', component: RosterDepthChart, beforeEnter: beforeEnter },
      // /roster/40-man
      { path: '40-man', name: 'roster-40-man', component: Roster40man, beforeEnter: beforeEnter },
      { path: 'non-roster', name: 'roster-non-roster', component: RosterNonRoster, beforeEnter: beforeEnter },
    ]
  }
]