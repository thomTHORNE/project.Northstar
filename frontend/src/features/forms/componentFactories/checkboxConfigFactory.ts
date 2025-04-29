import { GenerateRandomId, VALIDATION_BEHAVIOUR } from "@/features/forms/config";
import { type ComponentConfigFactoryInput, type FieldConfig } from "@/features/forms/interfaces";
import Checkbox from "primevue/checkbox";

export function checkboxConfigFactory(element: ComponentConfigFactoryInput): FieldConfig {
    // const importValue = ( value ) => castToSpec( value, element.dataType );
    const importValue = (value) => value;
    const exportValue = (value) => value;

    return {
        internalValue: importValue(element.value),
        importValue,
        exportValue,
        defaultVeeValidateOptions: {
            type: 'checkbox',
            checkedValue: true,
            ...VALIDATION_BEHAVIOUR
        },
        defaultTemplateBinds: {
            binary: true
        },
        // @ts-ignore
        // componentLoader: defineAsyncComponent( () => import('/node_modules/primevue/checkbox/checkbox.esm.js' ) )
        componentLoader: Checkbox,
        componentId: GenerateRandomId()
    }
}