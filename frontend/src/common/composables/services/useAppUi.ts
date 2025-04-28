import { computedAsync, useDebounceFn, useStorage } from "@vueuse/core";
import { Ref, ref, reactive, computed, readonly } from "vue";


const activeRequests: Ref<string[]> = ref([]);

export enum Warmth {
    Solarized = 'Solarized',
    Overcast = 'Overcast'
}
interface Source {
    appDarkTheme: boolean
    warmth: Warmth
    appFontSize: number
}
const source: Source = {
    appDarkTheme: false,
    warmth: Warmth.Overcast,
    appFontSize: 14
};
const state = useStorage('app-ui', source)


export function useAppUi() {
    function setActiveRequest(inputEndpoint: string) {
        activeRequests.value.push(inputEndpoint);
        activeRequests.value = [...activeRequests.value]
    }

    function removeRequest(inputEndpoint: string) {
        activeRequests.value = activeRequests.value.filter(endpoint => endpoint != inputEndpoint);
    }

    const computeLockState = (endpoints: Readonly<Ref<string[] | undefined>>) => {
        return computedAsync(async () => {
            const watchSource = activeRequests.value

            const test = endpoints.value?.some(endpoint => {
                const regex = new RegExp(endpoint, 'i');
                return watchSource.some(request => regex.test(request))
            })

            if (test) return test
            else return await useDebounceFn(() => test, 500)();
        }, false);
    }


    function toggleTheme() {
        setTheme(!state.value.appDarkTheme)
    }

    function setTheme(value: boolean) {
        if (!document.startViewTransition) {
            execute(value);

            return;
        }

        document.startViewTransition(() => execute(value));

        function execute(value: boolean) {
            state.value.appDarkTheme = value;
            document.documentElement.classList[state.value.appDarkTheme ? 'add' : 'remove']('app-dark-theme');
        };
    };
    setTheme(state.value.appDarkTheme)

    function toggleWarmth() {
        setWarmth(state.value.warmth === Warmth.Overcast ? Warmth.Solarized : Warmth.Overcast);
    }

    function setWarmth(value: Warmth) {
        state.value.warmth = value;
    }

    function setAppFontSize(value?: number) {
        state.value.appFontSize = value ?? 14;
        document.documentElement.style.fontSize = state.value.appFontSize + 'px';
    }
    setAppFontSize(state.value.appFontSize)


    return {
        activeRequests: readonly(activeRequests),
        setActiveRequest,
        removeRequest,
        computeLockState,
        state: readonly(state),
        toggleTheme,
        toggleWarmth,
        setAppFontSize
    }
}