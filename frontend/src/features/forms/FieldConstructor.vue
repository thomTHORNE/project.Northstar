<script setup lang="ts">
import { Field } from "./useFormSetup";
import { computed, ref, watch } from "vue";
import { FormContext, useField } from "vee-validate";

const prop = defineProps<{
  field: Field; 
  propertyName?: string,
  label?: string,
  inputClass?: string,
  fieldTemplateBinds?: Record<string, any>,
  /**
   * Didn't implement a default to `prop.field.element.cssClass` because I don't know what it should modify; 
   * the FieldConstructor or the PrimeVue component?
   */
  labelClass?: string,
  fieldDescription?: string,
  fieldDescriptionClass?: string,
  errorClass?: string
}>();

const { errorMessage, setValue, value } = useField(() => prop.propertyName ?? prop.field.element.propertyName, undefined, {
  form: prop.field.formContext,
  ...prop.field.config.defaultVeeValidateOptions,
});

const internalValue = ref(prop.field.config.internalValue);

watch(internalValue, (_internalValue) => {
  setValue(prop.field.config.exportValue(_internalValue), prop.field.config.defaultVeeValidateOptions.validateOnValueUpdate)
});

/**
 * @TT confirm this statement
 * This will register an update whenever the form (relating to prop.formContext) is reset.
 */
watch(value, _value => {
  const newValue = prop.field.config.importValue(_value);
  // Test the necessity of this check before internalValue update.
  // if (stateChanged( newValue, internalValue.value ))
  //  internalValue.value = newValue;
});

function stateChanged(newValue: any, sourceValue: any) {
  let validator: (nv: typeof newValue, sv: typeof sourceValue) => boolean = (nv, sv) => nv == sv;

  if (Array.isArray(newValue) && Array.isArray(sourceValue)) validator = (newValue, sourceValue) => (difference(newValue, sourceValue) as Array<typeof sourceValue>).length > 0
  else if (typeof sourceValue === 'object') validator = (newValue, sourceValue) => isEqual(newValue, sourceValue)

  return !validator(newValue, sourceValue)
}

const templateBinds = computed(() => ({
  ...prop.field.config.defaultTemplateBinds,
  ...prop.fieldTemplateBinds
}))

// === DEV ONLY ===
// const devFieldConfig = computed(() => {
//   const { defaultTemplateBinds, defaultVeeValidateOptions } = prop.field.config
//   return {
//     defaultVeeValidateOptions,
//     defaultTemplateBinds
//   }
// });
</script>


<template>
  <div class="field">
    <label
      :for="prop.field.config.componentId"
      :class="labelClass"
    >{{ label ?? prop.field.element.labelText }}</label>
    <small
      v-if="fieldDescription ?? field.element.descriptionHtml"
      class="block mb-3 mt-0 text-600"
      :class="fieldDescriptionClass"
      v-html="fieldDescription ?? field.element.descriptionHtml"
    ></small>
    <component
      :is="prop.field.config.componentLoader"
      v-model="internalValue"
      :id="prop.field.config.componentId"
      :class="inputClass ?? 'w-full'"
      v-bind="templateBinds"
    />
    <small
      v-if="errorMessage"
      class="block mt-2 p-error"
      :class="errorClass"
    >{{ errorMessage }}</small>

    <!-- <details class="mt-3 dev">
      <summary class="cursor-pointer dev-summary">Dev config</summary>
      <pre class="block mb-3 dev-code">Field id: {{ prop.field.config.componentId }}</pre>
      <pre class="block mb-3 dev-code">Field prop name: {{ propertyName ?? prop.field.element.propertyName }}</pre>
      <pre class="block mb-3 dev-code">Field component value: {{ internalValue }}</pre>
      <pre class="block mb-3 dev-code">Field component type: {{ typeof internalValue }}</pre>
      <pre class="block mb-3 dev-code">Field form value: {{ value }}</pre>
      <pre class="block mb-3 dev-code">Field form type: {{ typeof value }}</pre>
      <pre class="dev-code">{{ devFieldConfig }}</pre>
    </details> -->

  </div>
</template>


<style scoped lang="scss">
:deep(.p-password-input) { 
  width: 100%;
}

// .field {
//   margin: 15px;
//   margin-bottom: 0px;
//   padding: 21px !important;
//   border: 1px solid #4e5461;
//   border-radius: 10px;
//   background-color: #1b1e2314;
// }

// .dev {
//   border: 1px solid #6a6b6d87;
//   border-radius: 3px;
// }

// .dev-summary {
//   padding: 5px;
//   background: #22282f24;
// }

// .dev-code {
//   padding: 15px;
// }

// html.dark {
//   .field {
//     background-color: #1b1e23;
//   }

//   .dev-summary {
//     background: #22282f;
//   }
// }
</style>