import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue') },
  { path: '/register', name: 'Register', component: () => import('../views/Register.vue') },
  { path: '/reset-password', name: 'ResetPassword', component: () => import('../views/ResetPassword.vue') },
  { path: '/admin', name: 'AdminDashboard', component: () => import('../views/AdminDashboard.vue') },
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Home', component: () => import('../views/Home.vue') },
      { path: 'settings', name: 'Settings', component: () => import('../views/Settings.vue') },
      { path: 'leaderboard', name: 'Leaderboard', component: () => import('../views/Leaderboard.vue') },
      { path: 'history', name: 'History', component: () => import('../views/HistoryView.vue') },
      { path: 'shop', name: 'Shop', component: () => import('../views/Shop.vue') },
    ]
  },
  {
    path: '/share/:share_code',
    component: () => import('../layouts/ShareLayout.vue'),
    meta: { requiresAuth: false },
    children: [
      { path: '', name: 'ShareHome', component: () => import('../views/ShareHome.vue') },
      { path: 'leaderboard', name: 'ShareLeaderboard', component: () => import('../views/ShareLeaderboard.vue') }
    ]
  }
]
const routerBaseRaw = (import.meta.env.VITE_ROUTER_BASE || '/class-pet-house/').trim()
const routerBase = `${routerBaseRaw.replace(/^\/?/, '/').replace(/\/+$/, '')}/`

const router = createRouter({
  history: createWebHistory(routerBase),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
