import { ValidatorFactoryInput } from "@/features/forms/interfaces";
import { DateSchema, NumberSchema, StringSchema, TestContext } from "yup";


export function requiredFactory(schema, validationConstraint: ValidatorFactoryInput) {
    return schema.required( validationConstraint.errorMessage || undefined )
}


export function minLengthFactory(schema, validationConstraint: ValidatorFactoryInput) {
    return (schema as StringSchema | NumberSchema | DateSchema).min( validationConstraint.compareValue as number, validationConstraint.errorMessage )
}


export function maxLengthFactory(schema, validationConstraint: ValidatorFactoryInput) {
    return (schema as StringSchema | NumberSchema | DateSchema).max( validationConstraint.compareValue as number, validationConstraint.errorMessage )
}


export function notEqualToFactory(schema, validationConstraint: ValidatorFactoryInput) {
    const compareValues = Array.isArray( validationConstraint.compareValue ) ? validationConstraint.compareValue : [validationConstraint.compareValue as number];

    return (schema).notOneOf( compareValues, validationConstraint.errorMessage )
}


export function propertyReferenceFactory(schema, validationConstraint?: ValidatorFactoryInput) {

    return schema.test( "testReference", validationConstraint?.errorMessage, (value: string, context: TestContext) => value === context.parent[validationConstraint?.comparePropertyName] )
}

export function emailFactory(schema, validationConstraint?: ValidatorFactoryInput) {
    function isValidEmail(email: string): boolean {
        const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return regex.test(email || '');
    };

    return schema.test("isEmail", validationConstraint?.errorMessage || "Email is not in the correct format", isValidEmail)
}