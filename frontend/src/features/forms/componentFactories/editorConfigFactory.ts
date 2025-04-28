import { GenerateRandomId, VALIDATION_BEHAVIOUR } from "@/features/forms/config";
import { ComponentConfigFactoryInput, FieldConfig } from "@/features/forms/interfaces";
import Editor from "primevue/editor";

export function editorConfigFactory(element: ComponentConfigFactoryInput): FieldConfig {
    const importValue = ( value ) => value;
    const exportValue = ( value ) => value;

    return {
        internalValue: importValue( element.value ),
        importValue,
        exportValue,
        defaultVeeValidateOptions: { ...VALIDATION_BEHAVIOUR },
        defaultTemplateBinds: {
            editorStyle: "word-break: break-word;"
        },
        // @ts-ignore
        // componentLoader: defineAsyncComponent( () => import('/node_modules/primevue/editor/editor.esm.js' ) )
        componentLoader: Editor,
        componentId: GenerateRandomId()
    }
}