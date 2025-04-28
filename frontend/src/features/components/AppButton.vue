<script setup lang="ts">
import Button from "primevue/button";
import { toRef, computed, useAttrs } from "vue";
import { useAppUi } from "@/common/composables/services/useAppUi";


const prop = defineProps<{
  lockOnEndpoints?: string[];
}>();
const attrs = useAttrs()

const { computeLockState } = useAppUi();
const uiLocked = computeLockState( toRef( () => prop.lockOnEndpoints ) );
const isDisabled = computed( () => attrs.disabled as boolean || uiLocked.value )
</script>

<template>
  <Button :loading="uiLocked" :disabled="isDisabled" :class="attrs.class ?? 'px-3 py-2'" :pt="{ label: { class: 'font-medium' }}"/>
</template>