import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from './useAuth.js'

const routes = [
  {
    path: '/',
    name: 'LandingPage',
    component: () => import('../LandingPage.vue')
  },
  {
    path: '/auth',
    name: 'AuthPage',
    component: () => import('../AuthPage.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tickets',
    name: 'TicketManagement',
    component: () => import('../TicketManagement.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory('/Ednut-Ticket-Vue/'),
  routes
})

// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useAuth()
  
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/auth')
  } else {
    next()
  }
})

export default router