import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import roster from './roster'

const router = createRouter({
  // router.go 등등 쓰려면..
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...roster,
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
  ]
})

export default router
