declare global {
    interface String {
        capitalizeFirst<T extends string>(): T;
        uncapitalizeFirst<T extends string>(): T;
    }
}

export function extendStringPrototype() {
    String.prototype.capitalizeFirst = function <T extends string>(this: string): T {
        return (this.charAt(0).toUpperCase() + this.slice(1)) as T;
    };

    String.prototype.uncapitalizeFirst = function <T extends string>(this: string): T {
        return (this.charAt(0).toLowerCase() + this.slice(1)) as T;
    };
}