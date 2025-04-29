import { type AfterFetchContext, createFetch } from "@vueuse/core";
import { useAppUi } from "@/common/composables/services/useAppUi";

const { setActiveRequest, removeRequest } = useAppUi();
let url = '';
export const useHttpClient = createFetch({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    options: {
        beforeFetch(ctx) {
            setActiveRequest(ctx.url)
            url = ctx.url;
            ctx.options.credentials = 'include' // Sends cookies set by the browser
            return ctx
        },
        afterFetch(ctx: AfterFetchContext) {
            removeRequest(url)
            url = '';
            return ctx
        },
        onFetchError(ctx) {
            removeRequest(url)
            url = '';
            return ctx
        }
    }
})