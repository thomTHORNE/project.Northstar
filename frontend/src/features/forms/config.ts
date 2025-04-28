import { CONSTRAINT_VALIDATOR_EXTENSION } from "#/features/forms/configExtension";
import { CmsDataType } from "@/common/contracts/cmsSchema";
import { checkboxConfigFactory } from "@/features/forms/componentFactories/checkboxConfigFactory";
import { datetimePickerConfigFactory } from "@/features/forms/componentFactories/datetimePickerConfigFactory";
import { dropdownConfigFactory } from "@/features/forms/componentFactories/dropdownConfigFactory";
import { editorConfigFactory } from "@/features/forms/componentFactories/editorConfigFactory";
import { numberConfigFactory } from "@/features/forms/componentFactories/numberConfigFactory";
import { passwordConfigFactory } from "@/features/forms/componentFactories/passwordConfigFactory";
import { textConfigFactory } from "@/features/forms/componentFactories/textConfigFactory";
import {
    emailFactory,
    maxLengthFactory,
    minLengthFactory,
    notEqualToFactory, propertyReferenceFactory,
    requiredFactory
} from "@/features/forms/validatorFactories";
import { FieldOptions } from "vee-validate";
import { array, boolean, date, number, Schema, string } from "yup";
import { FieldDataType, ValidationConstraint } from "./interfaces";
import { inputEmbedConfigFactory } from "./componentFactories/inputEmbedConfigFactory";


/**
 * Custom ID generator.
 * @TT TODO: Replace with https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol
 */
export function GenerateRandomId() {
    return window.crypto.randomUUID();
}

/**
 * Default vee validate form validation behaviour; applied to every field config instance.
 */
export const VALIDATION_BEHAVIOUR: FieldOptions = {
    validateOnValueUpdate: false
};

/**
 * - `DATA_TYPE_SCHEMA` mapping __must__ support both `FieldDataType` and `CmsDataType`.
 * - Implemented in `useFormSetup()`. 
 * - Implementation __must__ ensure "camelCase" notation. 
 */
const DATA_TYPE_SCHEMA: [(CmsDataType | FieldDataType)[], Schema][] = [
    [["number", "int", "int?"], number()],
    [["string", "string?"], string()],
    [["date", "DateTime"], date()],
    [["boolean", "bool"], boolean()],
    [["string[]"], array()]
];

export function getFieldDataTypeSchema(key: CmsDataType | FieldDataType) {
    return DATA_TYPE_SCHEMA.filter(map => map[0].some(data => data.uncapitalizeFirst() == key.uncapitalizeFirst()))[0][1];
};

/**
 * Implemented in `useFormSetup()` and matching `CmsSchemaElementConstraintType`, but implementation __must__ ensure "camelCase" notation. 
 */
export type FieldConstraintType = keyof typeof CONSTRAINT_VALIDATOR;
export const CONSTRAINT_VALIDATOR = {
    notNull: requiredFactory,
    minLength: minLengthFactory,
    maxLength: maxLengthFactory,
    notEqualTo: notEqualToFactory,
    email: emailFactory,
    propertyReference: propertyReferenceFactory,
    // None,
    // IsNull,
    // EqualTo,
    // GreaterThan,
    // GreaterThanOrEqualTo,
    // LessThan,
    // LessThanOrEqualTo,
    ...CONSTRAINT_VALIDATOR_EXTENSION
} as const;
export function constraintValidatorTypeCheck<T extends Record<string, (schema: any, validationConstraint: ValidationConstraint) => Schema>>(constraintValidatorExtension: T): T { return constraintValidatorExtension }

/**
 * Implemented in `useFormSetup()` and matching `CmsComponentType`, but implementation __must__ ensure "camelCase" notation. 
 */
export type FieldComponentType = keyof typeof COMPONENT_TYPE;
export const COMPONENT_TYPE = {
    textField: textConfigFactory,
    textArea: textConfigFactory,
    dateTimePicker: datetimePickerConfigFactory,
    checkbox: checkboxConfigFactory,
    dropDown: dropdownConfigFactory,
    password: passwordConfigFactory,
    editor: editorConfigFactory,
    number: numberConfigFactory,
    inputEmbed: inputEmbedConfigFactory
    //     [FieldComponentName.autoComplete]: defineAsyncComponent( () => import('/node_modules/primevue/autocomplete/autocomplete.esm.js' ) ),
    //     [FieldComponentName.calendar]: defineAsyncComponent( () => import('/node_modules/primevue/Calendar/Calendar.esm.js' ) ),
    //     [FieldComponentName.checkbox]: defineAsyncComponent( () => import('/node_modules/primevue/checkbox/checkbox.esm.js' ) ),
    //     [FieldComponentName.chips]: defineAsyncComponent( () => import('/node_modules/primevue/chips/chips.esm.js' ) ),
    //     [FieldComponentName.colorPicker]: defineAsyncComponent( () => import('/node_modules/primevue/colorpicker/colorpicker.esm.js' ) ),
    //     [FieldComponentName.dropdown]: defineAsyncComponent( () => import('/node_modules/primevue/dropdown/dropdown.esm.js' ) ),
    //     [FieldComponentName.inputMask]: defineAsyncComponent( () => import('/node_modules/primevue/inputmask/inputmask.esm.js' ) ),
    //     [FieldComponentName.inputNumber]: defineAsyncComponent( () => import('/node_modules/primevue/inputnumber/inputnumber.esm.js' ) ),
    //     [FieldComponentName.inputSwitch]: defineAsyncComponent( () => import('/node_modules/primevue/inputswitch/inputswitch.esm.js' ) ),
    //     [FieldComponentName.inputText]: defineAsyncComponent( () => import('/node_modules/primevue/inputtext/inputtext.esm.js' ) ),
    //     [FieldComponentName.listbox]: defineAsyncComponent( () => import('/node_modules/primevue/listbox/listbox.esm.js' ) ),
    //     [FieldComponentName.multiSelect]: defineAsyncComponent( () => import('/node_modules/primevue/multiselect/multiselect.esm.js' ) ),
    //     [FieldComponentName.password]: defineAsyncComponent( () => import('/node_modules/primevue/password/password.esm.js' ) ),
    //     [FieldComponentName.radioButton]: defineAsyncComponent( () => import('/node_modules/primevue/radiobutton/radiobutton.esm.js' ) ),
    //     [FieldComponentName.rating]: defineAsyncComponent( () => import('/node_modules/primevue/rating/rating.esm.js' ) ),
    //     [FieldComponentName.selectButton]: defineAsyncComponent( () => import('/node_modules/primevue/selectbutton/selectbutton.esm.js' ) ),
    //     [FieldComponentName.slider]: defineAsyncComponent( () => import('/node_modules/primevue/slider/slider.esm.js' ) ),
    //     [FieldComponentName.editor]: defineAsyncComponent( () => import('/node_modules/primevue/editor/editor.esm.js' ) ),
    //     [FieldComponentName.textarea]: defineAsyncComponent( () => import('/node_modules/primevue/textarea/textarea.esm.js' ) ),
    //     [FieldComponentName.toggleButton]: defineAsyncComponent( () => import('/node_modules/primevue/toggleButton/togglebutton.esm.js' ) ),
    //     [FieldComponentName.treeSelect]: defineAsyncComponent( () => import('/node_modules/primevue/treeSelect/treeselect.esm.js' ) )
} as const;