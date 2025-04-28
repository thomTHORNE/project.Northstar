import { Ref, watch } from "vue";
import { useTimeoutFn } from "@vueuse/core";

interface UseCancellableActionOptions {
    interval?: number
    immediate?: boolean
}

export function useCancellableAction( subject: Ref<any>, successCallback: () => void, abortCallback: () => void, options: UseCancellableActionOptions = {} ) {
    const {
        interval = 600,
        immediate = false
    } = options;

    const { isPending, start, stop } = useTimeoutFn( () => null, () => interval, { immediate } )
    let canExecute = false;
    let success = false;

    return watch( ([subject, isPending]), ( [value, pendingVal] ) => {
        if (!value) {
            abortCallback();

            canExecute = false
            success = false;
            stop()
        }

        if (!pendingVal && value && canExecute && !success) {
            successCallback();

            canExecute = false;
            success = true;
        }

        if (!pendingVal && value && !success) {
            start()

            canExecute = true;
        }
    } )
}