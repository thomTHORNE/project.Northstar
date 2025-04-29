import { GenerateRandomId, VALIDATION_BEHAVIOUR } from "@/features/forms/config";
import { ApplicationLocaleOptions } from "@/features/i18n/localeOptions";
import InputNumber from "primevue/inputnumber";
import type { ComponentConfigFactoryInput, FieldConfig } from "../interfaces";

export function numberConfigFactory(element: ComponentConfigFactoryInput): FieldConfig {
    const importValue = (value) => value;
    const exportValue = (value) => value;

    return {
        internalValue: importValue(element.value),
        importValue,
        exportValue,
        defaultVeeValidateOptions: { ...VALIDATION_BEHAVIOUR },
        defaultTemplateBinds: {
            locale: ApplicationLocaleOptions.numberLocale
        },
        // @ts-ignore
        // componentLoader: defineAsyncComponent( () => import('/node_modules/primevue/checkbox/checkbox.esm.js' ) )
        componentLoader: InputNumber,
        componentId: GenerateRandomId()
    }
}