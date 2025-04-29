import { GenerateRandomId, VALIDATION_BEHAVIOUR } from "@/features/forms/config";
import { type ComponentConfigFactoryInput, type FieldConfig } from "@/features/forms/interfaces";
import { ApplicationLocaleOptions } from "@/features/i18n/localeOptions";
import { DatePicker } from "primevue";

export function datetimePickerConfigFactory(element: ComponentConfigFactoryInput): FieldConfig {
    // const importValue = ( value: string | Date ) => {
    //     if (typeof value === "string") return castToSpec( value, DataType.DateTime )
    //     else return value
    // };
    const importValue = (value) => value;
    const exportValue = (value) => value;

    return {
        internalValue: importValue(element.value),
        importValue,
        exportValue,
        defaultVeeValidateOptions: { ...VALIDATION_BEHAVIOUR },
        defaultTemplateBinds: {
            showIcon: true,
            hourFormat: ApplicationLocaleOptions.hourFormat,
            dateFormat: ApplicationLocaleOptions.dateFormat,
            showButtonBar: true
        },
        // @ts-ignore
        // componentLoader: defineAsyncComponent( () => import('/node_modules/primevue/Calendar/Calendar.esm.js' ) ),
        componentLoader: DatePicker,
        componentId: GenerateRandomId()
    }
}