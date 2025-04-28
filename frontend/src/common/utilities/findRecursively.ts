type ValueType = string | number | null | undefined;
export interface FindRecursivelyReturn<T = Record<string, any>> {
    item: T,
    index: number,
    scope: T[],
    path: Record<string, boolean>
}
export function findRecursively<T>( array: T[], recursiveKey: keyof T, propertyName: keyof T, valueToFind: ValueType, path: Record<string, boolean> = {} ): FindRecursivelyReturn<T> | undefined {

    return array.map( ( item, index ) => {
        if ([item[propertyName] as ValueType].includes( valueToFind )) {
            return { item, index, scope: array, path }
        }
        if (item[recursiveKey]) {
            const computedProperty = item[propertyName] as string | number;

            return findRecursively(
                item[recursiveKey] as T[],
                recursiveKey,
                propertyName,
                valueToFind,
                {
                    [computedProperty!]: true,
                    ...path
                }
            )
        }
    } ).filter( item => Boolean( item ) )[0]
}