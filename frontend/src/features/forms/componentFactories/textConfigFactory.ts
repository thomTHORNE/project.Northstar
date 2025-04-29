import { GenerateRandomId, VALIDATION_BEHAVIOUR } from "@/features/forms/config";
import InputText from "primevue/inputtext";
import type { ComponentConfigFactoryInput, FieldConfig } from "../interfaces";

export function textConfigFactory(element: ComponentConfigFactoryInput): FieldConfig {
    const importValue = (value) => value;
    const exportValue = (value) => value;

    return {
        internalValue: importValue(element.value),
        importValue,
        exportValue,
        defaultVeeValidateOptions: { ...VALIDATION_BEHAVIOUR },
        defaultTemplateBinds: {},
        // @ts-ignore
        // componentLoader: defineAsyncComponent( () => import('/node_modules/primevue/inputtext/inputtext.esm.js' ) ),
        componentLoader: InputText,
        componentId: GenerateRandomId()
    }
}