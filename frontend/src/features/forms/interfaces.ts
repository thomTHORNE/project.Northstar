

// export type PrimitiveType = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";

import type { CmsListItem } from "@/common/contracts/cmsList";
import type { CmsDataType, CmsSchemaElementConstraint } from "@/common/contracts/cmsSchema";
import type { CmsTreeView } from "@/common/contracts/cmsTree";
import type { FieldOptions } from "vee-validate";
import type { FieldComponentType, FieldConstraintType } from "./config";

export type FieldDataType = "number" | "string" | "string[]" | "boolean" | "date";
export interface FormElement {
    componentType: FieldComponentType;                     // Component type identifier
    dataType: FieldDataType;                               // Underlying C# data type, note: "?" will be used to indicate nullable types (e.g. int?)
    propertyName: string;                                  // Property name (exact as on data source object)
    nullable: boolean;                                     // True, if NULL is allowed
    readonly: boolean;                                     // True, if value editing is not allowed by the user
    value?: any;                                           // Will hold the value (of respective type)
    labelText: string;                                     // Input label text
    descriptionHtml?: string;                              // Input description markup (HTML)
    cssClass?: string;                                     // CSS class name to encapsulate the entire UI component
    validationConstraints?: ValidationConstraint[];        // List of value validation constraints
    embedItems?: EmbedItems;
    dropDownOptions?: DropDownOptions;                     // Present if componentType value is "dropDown"
    filterOptions?: FilterOption;                          // Filter options, or null if none
}

export interface ValidationConstraint {
    constraintType: FieldConstraintType;                   // constraint type that defines the validation behavior
    propertyName?: string;                                 // property name of the field element that is being validated
    comparePropertyName?: string;                          // property name of the field element whose value will be used to validate against
    compareValue?: number | string | null;                 // explicit value used to validate against (instead of the 'comparePropertyName')
    errorMessage?: string;                                 // error message that is to be displayed if the constraint validation criteria is not met
    errorCssClass?: string;                                // (optional) css class that will be used when constraint validation criteria is not met
    constraints?: unknown[];                               // array of sub/conditional constraints (WARNING: TBD: MECHANICS IS TO BE DEFINED)
}

export type EmbedItems = Array<string>

export interface DropDownOptions {
    list?: Array<CmsListItem>;
    treeView?: CmsTreeView;
}

// export type FilterType = "none" | "equalTo" | "notEqualTo" | "contains" | "doesNotContain" | "startsWith" | "endsWith" | "greaterThan" | "greaterThanOrEqualTo" | "lessThan" | "lessThanOrEqualTo";
export interface FilterOption {
    // filterType: FilterType,
    propertyName: string,
    value: any | null
}

export interface FieldConfig {
    internalValue: any,
    importValue: ( value: any ) => any,
    exportValue: ( value: any ) => any,
    defaultVeeValidateOptions: Partial<FieldOptions>,
    defaultTemplateBinds: Record<string, any>,
    componentLoader: string | Object,
    componentId: string
}

// export type ComponentConfigFactoryInput = Pick<FormElement | CmsSchemaElement, "value" | "dataType" | "dropDownOptions">;
export type ComponentConfigFactoryInput = { dataType: FieldDataType | CmsDataType, value?: any, dropDownOptions?: DropDownOptions, embedItems?: EmbedItems };
export type ValidatorFactoryInput = Pick<ValidationConstraint | CmsSchemaElementConstraint, "comparePropertyName" | "compareValue" | "errorMessage">;