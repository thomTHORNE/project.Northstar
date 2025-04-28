import { ROUTE_META_EXTENSION } from "#/common/constants/routeMetaExtension";

export const ROUTE_META = {
    home: { name: "Home", path: "/" },
    login: { name: "Login", path: "/login" },
    edit: { name: "Edit", path: "" },
    notFound: { name: "NotFound", path: "/:pathMatch(.*)*" },
    ...ROUTE_META_EXTENSION
};

interface Route {
    name: string;
    path: string;
}
export function routeMetaTypeCheck<T extends Record<string, Route>>(routeMetaExtension: T): T { return routeMetaExtension }