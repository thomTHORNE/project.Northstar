import { type CmsSchemaElement } from "@/common/contracts/cmsSchema";
import { type FieldConfig, type FormElement } from "@/features/forms/interfaces";
import { type FormContext, useForm } from "vee-validate";
import { computed, type ComputedRef, type Ref, watch } from "vue";
import { object, type ObjectShape } from "yup";
import { COMPONENT_TYPE, CONSTRAINT_VALIDATOR, type FieldComponentType, type FieldConstraintType, getFieldDataTypeSchema } from "./config";


export interface UseFormSetup {
    initialValues: ComputedRef<Record<string, any>>
    fields: ComputedRef<Record<string, Field>>
    fieldsArray: ComputedRef<Array<Field>>
    fieldNames: ComputedRef<Record<string, string>>
    formGroups: ComputedRef<Record<string, Array<Field> | undefined>>
    form: FormContext
}


export interface Field {
    element: FormElement | CmsSchemaElement
    config: FieldConfig
    formContext: FormContext
}

export type ElementsInput = Ref<Array<FormElement | CmsSchemaElement> | undefined>;
export type GroupsInput = Ref<Record<string, Array<FormElement | CmsSchemaElement>>>;

export function useFormSetup(elementsOrGroups: ElementsInput | GroupsInput): UseFormSetup {
    let _elements = computed(() => {
        if (elementsOrGroups.value == undefined || elementsOrGroups.value == null) return undefined
        if (Array.isArray(elementsOrGroups.value)) return elementsOrGroups.value;
        else return Object.values((elementsOrGroups as GroupsInput).value).reduce((target, group) => {
            group && target.push(...group);
            return target
        }, []) as Array<FormElement | CmsSchemaElement>;
    });


    const initialValues = computed(() => {
        return (_elements.value ?? []).reduce((target, element) => {
            Object.assign(target, {
                [element.propertyName]: element.value
            })
            return target
        }, {})
    });
    watch(initialValues, _initialValues => {
        form.setValues(_initialValues)
    })


    function createFieldValidationSchema(element: Pick<FormElement | CmsSchemaElement, "dataType" | "validationConstraints">) {
        let schema = getFieldDataTypeSchema(element.dataType)
            // Indicates that null is a valid value for the schema. Without nullable() null is treated as a different type and will fail Schema.isType() checks.
            .nullable();
        // Mark the schema as not required. This is a shortcut for schema.nullable().optional();
        // Schema.optional(): Schema
        // The opposite of defined() allows undefined values for the given type.
        // .notRequired();
        // schema = emailFactory(schema);

        element.validationConstraints?.forEach((validationConstraint) => {
            const addValidator = CONSTRAINT_VALIDATOR[validationConstraint.constraintType.uncapitalizeFirst<FieldConstraintType>()];
            const schemaUpdate = addValidator?.(schema, validationConstraint)
            if (schemaUpdate) schema = schemaUpdate;
        })

        return schema;
    }


    const validationSchema = computed(() => object(_elements.value?.reduce((target: ObjectShape, current: FormElement | CmsSchemaElement) => {
        Object.assign(target, {
            [current.propertyName]: createFieldValidationSchema(current)
        })
        return target
    }, {} as ObjectShape) as ObjectShape));


    const form = useForm({
        validationSchema,
        initialValues
    });


    const fieldsArray: ComputedRef<Field[]> = computed(() =>
        _elements.value?.map(element => ({
            element,
            config: COMPONENT_TYPE[element.componentType.uncapitalizeFirst<FieldComponentType>()](element),
            formContext: form
        }))
        ?? []
    );


    const fields = computed(() => fieldsArray.value.reduce((target, current) => {
        Object.assign(target, {
            [current.element.propertyName]: current
        })
        return target
    }, {}) as Record<string, Field>
    );


    const fieldNames = computed(() => _elements.value?.reduce((target, element) => {
        Object.assign(target, {
            [element.propertyName.toLowerCase()]: element.propertyName
        })
        return target
    }, {}) as Record<string, string>);


    const formGroups = computed<Record<string, Array<Field>>>(() => {
        if (elementsOrGroups.value !== undefined && !Array.isArray(elementsOrGroups.value)) {
            const _ = Object.entries(elementsOrGroups.value).reduce((target, current) => {
                Object.assign(target, {
                    [current[0]]: current[1].map(element => fields.value[element.propertyName])
                });
                return target
            }, {})
            return _
        }
        else return {}
    });


    return {
        fields,
        fieldsArray,
        formGroups,
        fieldNames,
        initialValues,
        form
    }
}