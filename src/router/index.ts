import { createRouter, createWebHistory } from 'vue-router'
import Authorization from '../views/Authorization.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'authorization',
      component: Authorization,
    },
    {
      path: '/redirect',
      name: 'redirect',
      // route level code-splitting
      // this generates a separate chunk (redirect.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Redirect.vue'),
    },
  ],
})

export default router
