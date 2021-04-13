import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Tabs from '../views/Tabs.vue'
import Login from '../views/Login.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
  {
    path: '/tabs/',
    component: Tabs,
    children: [
      {
        path: '',
        redirect: '/tabs/ClassesTab'
      },
      {
        path: 'ClassesTab',
        name: 'ClassesTab',
        component: () => import('@/views/ClassesTab.vue')
      },
      {
        path: 'QRTab',
        name: 'QRTab',
        component: () => import('@/views/QRTab.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
