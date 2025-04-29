
import Editor from "primevue/editor";
import { VALIDATION_BEHAVIOUR, GenerateRandomId } from "../config";
import type { ComponentConfigFactoryInput, FieldConfig } from "../interfaces";

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