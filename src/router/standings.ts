import StandingsView from "@/views/StandingsView.vue";
import { RouteLocationNormalized } from "vue-router";
import { useDate } from "@/composables";

const date = useDate();

export default [
  {
    path: '/standings',
    redirect: {
      name: 'standings',
      params: { season: date.year }
    }
  },
  {
    path: '/standings/:season',
    name: 'standings',
    component: StandingsView,
    beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: Function) => {
      const year = Number(to.params.season)
      if (year > date.year) next({ name: 'standings', params: { season: 2024 } })
      else if (year < 1876) next({ name: 'standings', params: { season: 1876 } })
      else next()
    }
  }
]