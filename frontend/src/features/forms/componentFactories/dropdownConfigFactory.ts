import { CmsListItem } from "@/common/contracts/cmsList";
import { CmsDataType } from "@/common/contracts/cmsSchema";
import { CmsTreeViewItem } from "@/common/contracts/cmsTree";
import { GenerateRandomId, VALIDATION_BEHAVIOUR } from "@/features/forms/config";
import { ComponentConfigFactoryInput, FieldConfig, FieldDataType } from "@/features/forms/interfaces";
import { MultiSelect, Select, TreeSelect } from "primevue";
import type { TreeNode } from "primevue/treenode";

export function dropdownConfigFactory(element: ComponentConfigFactoryInput): FieldConfig | (() => void) {
    const switcher: Record<string, {
        factory: () => FieldConfig | (() => void);
        condition: () => boolean;
    }> = {
        select: {
            factory: selectConfig.bind(undefined, element),
            condition: () => Boolean(element.dropDownOptions?.list) && (["string[]"] as Array<FieldDataType | CmsDataType>).includes(element.dataType) === false,
        },
        multiSelect: {
            factory: multiSelectConfig.bind(undefined, element),
            condition: () => Boolean(element.dropDownOptions?.list) && (["string[]"] as Array<FieldDataType | CmsDataType>).includes(element.dataType) === true,
        },
        tree: {
            factory: dropdownTreeConfig.bind(undefined, element),
            condition: () => !Boolean(element.dropDownOptions?.list) && (["string[]"] as Array<FieldDataType | CmsDataType>).includes(element.dataType) === false
        },
        default: {
            factory: () => { throw Error("Input conditions have not been met to create a config for a dropdown component.") },
            condition: () => true
        }
    }
    return Object.values(switcher).find(dropdownType => dropdownType.condition())!.factory()
}

function multiSelectConfig(element: ComponentConfigFactoryInput): FieldConfig {
    // const importValue = (value) => castToSpec(value, typeof element.dropDownOptions.list?.[0].value);
    // const exportValue = ( value ) => castToSpec( value, element.dataType );
    const importValue = (value) => value;
    const exportValue = (value) => value;
    const listAdapter = (item: CmsListItem) => ({ text: item.text, value: item.value });

    const options = element.dropDownOptions?.list?.map(item => listAdapter(item));

    return {
        internalValue: importValue(element.value),
        importValue,
        exportValue,
        defaultVeeValidateOptions: { ...VALIDATION_BEHAVIOUR },
        defaultTemplateBinds: {
            optionLabel: "text",
            optionValue: "value",
            options,
            display: "chip",
            showToggleAll: false
        },
        componentLoader: MultiSelect,
        componentId: GenerateRandomId()
    }
}

function selectConfig(element: ComponentConfigFactoryInput): FieldConfig {
    // const importValue = (value) => castToSpec(value, typeof element.dropDownOptions.list?.[0].value);
    // const exportValue = ( value ) => castToSpec( value, element.dataType );
    const importValue = (value) => value;
    const exportValue = (value) => value;
    const listAdapter = (item: CmsListItem) => ({ text: item.text, value: item.value });

    const options = element.dropDownOptions?.list?.map(item => listAdapter(item));

    return {
        internalValue: importValue( element.value ),
        importValue,
        exportValue,
        defaultVeeValidateOptions: { ...VALIDATION_BEHAVIOUR },
        defaultTemplateBinds: {
            optionLabel: "text",
            optionValue: "value",
            options,
        },
        // @ts-ignore
        // componentLoader: defineAsyncComponent( () => import('/node_modules/primevue/dropdown/dropdown.esm.js' ) )
        componentLoader: Select,
        componentId: GenerateRandomId()
    }
}

function dropdownTreeConfig(element: ComponentConfigFactoryInput): FieldConfig {
    const treeNodeAdapter = (item: CmsTreeViewItem): TreeNode => ({
        key: item.id.toString(),
        label: item.title,
        data: item,
        icon: 'pi pi-fw pi-inbox',
        children: item.items?.map(childItem => treeNodeAdapter(childItem))
    });

    const options = element.dropDownOptions?.treeView.items.map(item => treeNodeAdapter(item));

    const importValue = (value: number | number[]): Record<string, boolean> | null => {
        const normalizeValue = ( value: Array<any> ) => value.filter( item => item !== null );
        const normalizedValue = Array.isArray(value) ? normalizeValue(value) : normalizeValue([value])

        const test = options.filter(option => normalizedValue.includes(Number(option.key)))
        if (test.length === 0) return null

        return normalizedValue.reduce((target, current) => {
            Object.assign( target, {
                [current]: true
            } )
            return target
        }, {} )
    };
    const exportValue = ( value: Record<string, boolean> ): unknown => {
        // Leaving this for a potential support of multiple selection feature
        // if (Object.keys( value ?? {} ).length > 0) return Object.entries( value ).map( entry => Number( entry[0] ) )
        if (Object.keys( value ?? {} ).length > 0) return Number( Object.keys( value ?? {} )[0] )
        return null
    };


    return {
        internalValue: importValue( element.value ),
        importValue,
        exportValue,
        defaultVeeValidateOptions: { ...VALIDATION_BEHAVIOUR },
        defaultTemplateBinds: {
            selectionMode: "single",
            metaKeySelection: false,
            options,
        },
        // @ts-ignore
        // componentLoader: defineAsyncComponent( () => import('/node_modules/primevue/treeselect/treeselect.esm.js' ) )
        componentLoader: TreeSelect,
        componentId: GenerateRandomId()
    }
}