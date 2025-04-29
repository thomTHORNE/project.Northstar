import { createRouter, createWebHistory } from 'vue-router';
import routesAuth from '@/features/auth/routes';
import { useHttpClient } from '@/common/composables/services/useHttpClient';
import { ROUTE_META } from './common/constants/routeMeta';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: ROUTE_META.home.path,
      name: ROUTE_META.home.name,
      component: () => import("@/features/layouts/Default.vue")
    },
    {
      path: ROUTE_META.notFound.path,
      name: ROUTE_META.notFound.name,
      component: () => import('@/features/404.vue'),
    },
    ...routesAuth
  ]
});

router.beforeResolve(async (to, from, next) => {
  next()
});

// router.beforeResolve(async (to, from, next) => {
//   const { data } = await useHttpClient('auth/isAuthenticated').json();
//   const isAuthenticated = data.value.result;

//   if (to.name === ROUTE_META.login.name) {
//     if (isAuthenticated) next({ name: ROUTE_META.home.name })
//     else next();
//   } else {
//     if (isAuthenticated) next();
//     else next({ name: ROUTE_META.login.name });
//   }
// });

export default router;