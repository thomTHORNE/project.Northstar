import type { RouteRecordRaw } from "vue-router";
import { LayoutName } from "@/features/layouts/layoutName";
import { ROUTE_META } from "@/common/constants/routeMeta";

const routes: RouteRecordRaw[] = [
  {
    path: ROUTE_META.login.path,
    name: ROUTE_META.login.name,
    component: () => import('./Login.vue'),
    meta: { layout: LayoutName.Blank }
  }
];

export default routes;