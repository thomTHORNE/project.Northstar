import { GenerateRandomId, VALIDATION_BEHAVIOUR } from "@/features/forms/config";
import Password from "primevue/password";
import type { ComponentConfigFactoryInput, FieldConfig } from "../interfaces";

export function passwordConfigFactory(element: ComponentConfigFactoryInput): FieldConfig {
    const importValue = ( value ) => value;
    const exportValue = ( value ) => value;

    return {
        internalValue: importValue( element.value ),
        importValue,
        exportValue,
        defaultVeeValidateOptions: { ...VALIDATION_BEHAVIOUR },
        defaultTemplateBinds: {
            feedback: false,
            toggleMask: true
        },
        // @ts-ignore
        // componentLoader: defineAsyncComponent( () => import('/node_modules/primevue/password/password.esm.js' ) ),
        componentLoader: Password,
        componentId: GenerateRandomId()
    }
}