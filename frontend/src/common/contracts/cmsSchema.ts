import { CmsListItem } from "./cmsList";
import { CmsTreeView } from "./cmsTree";


enum CmsPageViewType {
    List = "List",
    Tree = "Tree"
}

export interface CmsSchema {
    id: number;                                                  // Active 'id' (if editing an existing item)
    tableName: string;                                           // Data source table name
    pageTitle: string;                                           // Edit page title, can be different from 'tableName'
    pageViewType: CmsPageViewType;                               // Used page view type (enumeration)
    conditions: unknown[];                                       // WARNING: TBD: general list of conditional elements (MIGHT GET CANCELLED)
    pageDescriptionHtml: string;                                 // Page description in HTML format
    elements: Array<CmsSchemaElement>;                           // List of schema elements used to generate and populate the form
    filters: Array<CmsSchemaElement>;                            // List of schema elements used to generate and populate the form (filters)
}

type CmsComponentType = "TextArea" | "TextField" | "DateTimePicker" | "Checkbox" | "DropDown" | "Editor" | "Number";
export type CmsDataType = "int" | "int?" | "string?" | "DateTime" | "bool";

export interface CmsSchemaElement {
    componentType: CmsComponentType;                             // Component type identifier
    dataType: CmsDataType;                                       // Underlying C# data type, note: "?" will be used to indicate nullable types (e.g. int?)
    propertyName: string;                                        // Property name (exact as on data source object)
    nullable: boolean;                                           // True, if NULL is allowed
    readonly: boolean;                                           // True, if value editing is not allowed by the user
    value?: any;                                                 // Will hold the value (of respective type)
    labelText: string;                                           // Input label text
    descriptionHtml?: string;                                    // Input description markup (HTML)
    cssClass?: string;                                           // CSS class name to encapsulate the entire UI component
    validationConstraints?: Array<CmsSchemaElementConstraint>;   // List of value validation constraints
    visibleConditionsAll?: [];                                   // WARNING: TBD: ALL conditions must be satisfied to show the UI component
    visibleConditionsAny?: [];                                   // WARNING: TBD: ANY conditions must be satisfied to show the UI component
    dropDownOptions: CmsDropDownOptions;                         // Present if componentType value is "dropDown"
    filterOptions: CmsFilterOption | null;                       // Filter options, or null if none
}

export type CmsSchemaElementConstraintType = "NotNull" | "MinLength" | "MaxLength" | "NotEqualTo" | "Email" | "None";
// PropertyReference: "propertyreference",
// IsNull,
// EqualTo,
// GreaterThan,
// GreaterThanOrEqualTo,
// LessThan,
// LessThanOrEqualTo,

export type CmsFilterType = "None" | "EqualTo" | "NotEqualTo" | "Contains" | "DoesNotContain" | "StartsWith" | "EndsWith" | "GreaterThan" | "GreaterThanOrEqualTo" | "LessThan" | "LessThanOrEqualTo";

export interface CmsSchemaElementConstraint {
    constraintType: CmsSchemaElementConstraintType;              // constraint type that defines the validation behavior
    propertyName?: string;                                       // property name of the field element that is being validated
    comparePropertyName?: string;                                // property name of the field element whose value will be used to validate against
    compareValue?: number | string | null;                       // explicit value used to validate against (instead of the 'comparePropertyName')
    errorMessage?: string;                                       // error message that is to be displayed if the constraint validation criteria is not met
    errorCssClass?: string;                                      // (optional) css class that will be used when constraint validation criteria is not met
    constraints?: unknown[];                                     // array of sub/conditional constraints (WARNING: TBD: MECHANICS IS TO BE DEFINED)
}

export interface CmsDropDownOptions {
    list: Array<CmsListItem>;
    treeView: CmsTreeView;
    placeholderText: string;
}

export interface CmsFilterOption {
    filterType: CmsFilterType,
    propertyName: string,
    value: any | null
}