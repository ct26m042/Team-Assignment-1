import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProgramView from '../views/ProgramView.vue'
import SessionDetailView from '../views/SessionDetailView.vue'
import MyProgramView from '../views/MyProgramView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/programm', name: 'program', component: ProgramView, meta: { rendering: 'isr' } },
    { path: '/sessions/:id', name: 'session', component: SessionDetailView, meta: { rendering: 'isr' } },
    { path: '/mein-programm', name: 'my-program', component: MyProgramView, meta: { rendering: 'csr' } },
  ],
})

export default router
