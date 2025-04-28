import { GenerateRandomId, VALIDATION_BEHAVIOUR } from "@/features/forms/config";
import { ComponentConfigFactoryInput, FieldConfig } from "@/features/forms/interfaces";
import InputEmbed, { InputEmbedProps } from "../components/InputEmbed.vue";

export function inputEmbedConfigFactory(element: ComponentConfigFactoryInput): FieldConfig {
    const importValue = (value) => value;
    const exportValue = (value) => value;
    if (!element.embedItems) throw Error('InputEmbed is missing a required embedItems prop.')
    const inputEmbedProps: InputEmbedProps = {
        embedItems: element.embedItems!
    }
    return {
        internalValue: importValue(element.value),
        importValue,
        exportValue,
        defaultVeeValidateOptions: { ...VALIDATION_BEHAVIOUR },
        defaultTemplateBinds: inputEmbedProps,
        componentLoader: InputEmbed,
        componentId: GenerateRandomId()
    }
}