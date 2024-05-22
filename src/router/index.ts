import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import roster from './roster'
import standings from './standings'
import transactions from './transactions'
import schedule from './schedule'

const router = createRouter({
  // router.go 등등 쓰려면..
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...roster,
    ...standings,
    ...transactions,
    ...schedule,
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    // 그 외 다른 주소들
    {
      path: '/:pathMatch(.*)*',
      name: 'error',
      component: () => import('@/views/404.vue'),
    }
  ]
})

export default router
