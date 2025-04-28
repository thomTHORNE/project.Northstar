import { DataType } from "@/features/forms/config";

export function castToSpec( value: any, specification: DataType ) {
    switch (specification) {
        case DataType.bool:
            if (typeof value === "boolean") return value
            if (typeof value === "string") {
                if (value?.toString().toLowerCase() === "true") return true;
                if (value?.toString().toLowerCase() === "false") return false;
            }
            break;

        case DataType.int:
        case DataType["int?"]:
            if (typeof value === "number") return value
            if (typeof value === "string") return Number( value );
            break;

        case DataType.string:
        case DataType["string?"]:
            if (typeof value === "string") return value;
            if (typeof value === "number") return value?.toString();
            break;

        case DataType.DateTime:
            return new Date( value );
    }

    return null
}