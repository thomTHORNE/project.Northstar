import type { Ref, ShallowUnwrapRef } from 'vue'
import { isRef } from 'vue'

export interface ExtendRefOptions<Unwrap extends boolean = boolean> {
    /**
     * Is the extends properties enumerable
     *
     * @default false
     */
    enumerable?: boolean

    /**
     * Unwrap for Ref properties
     *
     * @default true
     */
    unwrap?: Unwrap
}

/**
 * Overload 1: Unwrap set to false
 */
export function extendRef<R extends Ref<any>, Extend extends object, Options extends ExtendRefOptions<false>>(ref: R, extend: Extend, options?: Options): ShallowUnwrapRef<Extend> & R
/**
 * Overload 2: Unwrap unset or set to true
 */
export function extendRef<R extends Ref<any>, Extend extends object, Options extends ExtendRefOptions>(ref: R, extend: Extend, options?: Options): Extend & R

export function extendRef<R extends Ref<any>, Extend extends object>(ref: R, extend: Extend, { enumerable = false, unwrap = true }: ExtendRefOptions = {}) {
    for (const [key, value] of Object.entries(extend)) {
        if (key === 'value')
            continue

        if (isRef(value) && unwrap) {
            Object.defineProperty(ref, key, {
                get() {
                    return value.value
                },
                set(v) {
                    value.value = v
                },
                enumerable,
            })
        }
        else {
            Object.defineProperty(ref, key, { value, enumerable, writable: false })
        }
    }
    return ref
}