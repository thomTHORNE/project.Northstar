import { extendRef } from "./extendRef";
import { customRef, reactive, type Ref, watch, type WatchOptions, type WatchSource } from "vue";

export interface DoRx<T, TControls = T> extends Ref<T> {
    subscribe<U>(
        source: WatchSource<U> | U & Array<WatchSource>,
        pipe: (data: { incoming: U, old: U }, context: { ref: Ref<T>, adapt: (incoming: TControls | T) => void }) => void,
        // pipe: (incoming: U | U[], internals: { ref: Ref<T>, adapt: (incoming: TControls | T) => void }) => void,
        watchOptions?: WatchOptions
    ): DoRx<T, TControls>;

    subscribe(
        source: WatchSource<T>,
        watchOptions?: WatchOptions
    ): DoRx<T, TControls>;

    ref: Ref<T>;

    adapt(incoming?: TControls | T): void;
}

/**
 * Options for customizing the behavior of the `doRx` reference.
 *
 * @template T The type of the value held by the reference.
 */
export interface DoRxOptions<T, TControls = T> {
    /**
     * A filter function that determines whether to accept an incoming value.
     * If provided, it’s called with the incoming value and current state.
     * Returning `false` skips the update; any other return value (or none) proceeds.
     */
    filter?: (incoming: TControls, state: T) => void | boolean;

    /**
     * A function to compute the new state based on the incoming value and current state.
     * If not provided, the incoming value is used directly as the new state.
     */
    adapter?: (incoming: TControls | T, state: T) => T;

    /**
     * A function intended for cleanup when the reference is disposed.
     */
    tail?: (state: T) => void;
}

/**
 * Creates a reactive reference with custom behavior for value updates and subscriptions.
 * The returned reference supports filtering and transforming incoming values and subscribing
 * to watch sources for reactive updates.
 *
 * @template T The type of the value held by the reference.
 * @param initialValue The initial value of the reference.
 * @param options Configuration options to customize filtering, setting, and cleanup behavior.
 * @returns A reactive reference extended with a `subscribe` method for chaining.
 *
 * @example
 * // Providing an initial value
 * const alwaysString = doRx("initial");
 * console.log(alwaysString.value); // "initial"
 *
 * @example
 * // Create a ref with a setter that transform strings to numbers
 * const numbersOnly = doRx<number, string>(0, {
 *     set: (incoming) => Number(incoming)
 * });
 * numbersOnly.value = "2"; // Reporting type incompatibility
 * numbersOnly.set("2"); // Parameter type is allowed and set will transform it to number
 * 
 * @example
 * // Create a ref that only accepts positive numbers
 * const positiveNum = doRx(0, {
 *     filter: (incoming) => typeof incoming === 'number' && incoming > 0 || false
 * });
 *
 * @example
 * // Subscribe to a source with a transformation
 * const source = ref(10);
 * positiveNum.subscribe(source, (incoming, ref) => ref.value = incoming * 2);
 */
export function doRx<T, TControls = T>(
    initialValue: T = undefined,
    options: DoRxOptions<T, TControls> = {}
): DoRx<T, TControls> {

    const { filter, adapter, tail } = options;

    let state = typeof initialValue === 'object' && !!initialValue ? reactive(initialValue) : initialValue;
    let track: () => void
    let trigger: () => void

    /**
     * Create a custom ref so we can have full control over when and how to set the incoming value.
     */
    const rxState = customRef<T>((_track, _trigger) => {
        track = _track;
        trigger = _trigger;

        return {
            get: () => {
                track()
                return state
            },
            set: (incoming) => {
                adapt(incoming)
            }
        }
    })

    // function adapt(incoming: TControls): void
    // function adapt(incoming: T): void
    function adapt(incoming?: TControls | T) {
        const staleState = state;

        if (filter?.(incoming, staleState) === false)
            return

        if (!!adapter) {
            const adaptedValue = adapter(incoming, staleState);

            /**
             * Double exclamation is required !! because `null` is also an object. 
             */
            if (typeof adaptedValue === 'object' && !!adaptedValue)
                state = reactive(adaptedValue);
            else
                state = adaptedValue;
        }
        else {
            state = incoming;
        }

        tail?.(state);

        trigger()
    }

    /**
     * Extend the custom ref with subscribe function for better code co-location.
     */
    const extendedRef = extendRef(
        rxState,
        {
            subscribe,
            adapt,
            ref: rxState
        },
        { enumerable: false, unwrap: false },
    )

    /**
     * Subscribes to a watch source, transforming its values via a pipe function.
     *
     * @template U The type emitted by the source.
     * @param source The reactive source to watch.
     * @param pipe Function to process incoming values and update the ref.
     * @param watchOptions Options for Vue’s watch function (e.g., immediate, deep).
     * @returns The extended reference for method chaining.
     */
    function subscribe<U>(
        source: WatchSource<U> | U & Array<WatchSource>,
        pipe: (data: { incoming: U, old: U }, context: { ref: Ref<T>, adapt: (incoming: TControls | T) => void }) => void,
        // pipe: (incoming: U | U[], internals: { ref: Ref<T>, adapt: (incoming: TControls | T) => void }) => void,
        watchOptions?: WatchOptions
    ): DoRx<T, TControls>;

    /**
     * Subscribes to a watch source that directly sets the ref’s value (source must emit T).
     *
     * @param source The reactive source emitting values of type T.
     * @param watchOptions Options for Vue’s watch function (e.g., immediate, deep).
     * @returns The extended reference for method chaining.
     */
    function subscribe(
        source: WatchSource<T>,
        watchOptions?: WatchOptions
    ): DoRx<T, TControls>;

    function subscribe(
        source: WatchSource<any> | Array<WatchSource>,
        pipeOrOptions?: ((data: { incoming: any, old: any }, context: { ref: Ref<T>, adapt: (incoming: TControls | T) => void }) => void) | WatchOptions,
        watchOptions?: WatchOptions
    ): DoRx<T, TControls> {
        let _pipe: ((data: { incoming: any, old: any }, context: { ref: Ref<T>, adapt: (incoming: TControls | T) => void }) => void) | undefined;
        let _watchOptions: WatchOptions | undefined;

        if (typeof pipeOrOptions === "function") {
            _pipe = pipeOrOptions;
            _watchOptions = watchOptions;
        } else {
            _watchOptions = pipeOrOptions;
        }

        if (_pipe) {
            // With a pipe function, TypeScript infers the raw source type.
            watch(source, (incoming, old) => _pipe({ incoming, old }, { ref: rxState, adapt }), _watchOptions);
        } else {
            // Without a pipe, assume the source already yields values of type T.
            watch(source as WatchSource, (incoming: T) => adapt(incoming), _watchOptions);
        }
        return extendedRef;
    }

    return extendedRef;
}
