<script setup lang="ts">
import type { MenuItem, MenuItemCommandEvent } from 'primevue/menuitem';
import Quill, { type QuillOptions, Delta } from 'quill';
import Embed from 'quill/blots/embed';
import { ref, useTemplateRef, type Ref, type ComputedRef, computed, watch, markRaw, onUnmounted } from 'vue';



/**
 * Refer to [ASCII Table](https://www.ascii-code.com/) for character codes.
 */

export interface InputEmbedProps {
  modelValue?: string;
  embedDropdownLabel?: string;
  embedDescription?: string;
  embedItems: Array<string>;
}

const editorRef = ref<HTMLElement>();
const menuRef = useTemplateRef('menuRef');
let quillInstance: Ref<Quill | undefined> = ref();

const props = defineProps<InputEmbedProps>();

const _embedItems: ComputedRef<Array<MenuItem>> = computed(() => props.embedItems.map(item => ({
  label: item,
  command: (event: MenuItemCommandEvent) => insertEmbed(event.item.label as string),
})))

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>();

//#region [ Extend Quill with custom embed element ]
class EmbedBlot extends Embed {
  static blotName = 'embed';
  static tagName = 'span';

  static create(value: string) {
    let element = super.create() as HTMLElement;
    element.setAttribute('data-embed', value);
    element.classList.add('embed-blot');
    element.textContent = value;
    return element;
  }

  static value(element: HTMLElement) {
    return element.getAttribute('data-embed'); // Return the value for serialization
  }
}
Quill.register(EmbedBlot, true);
//#endregion


//#region [ Setup Quill ]
watch(editorRef, _editorRef => {
  const options: QuillOptions = {
    theme: 'snow',
    modules: {
      toolbar: false,
      keyboard: {
        bindings: {
          enter: {
            key: 'Enter',
            shiftKey: null,
            handler: () => {
              return false;
            },
          },
        },
      },
    }
  };
  quillInstance.value = markRaw(new Quill(editorRef.value, options));

  quillInstance.value.on('text-change', () => {
    emit('update:modelValue', getEditorValue());
  });
}, { once: true })

onUnmounted(() => {
  quillInstance.value = undefined;
});

/**
 * Returns formatted Quill content.
 * - embeds are surrounded with `{{}}` 
 * - plain strings are returned as-is  
 */
function getEditorValue() {
  const contents = quillInstance.value.getContents();
  let output = '';

  contents.ops?.forEach(op => {
    if (typeof op.insert === 'string') {
      output += op.insert;
    } else if (op.insert && 'embed' in op.insert) {
      output += `{{${(op.insert as { embed: string }).embed}}}`;
    }
  });
  return output
}

//#region [ Set Quill content ]
const delta = computed(() => {
  const delta = new Delta();
  const regex = /{{[^{}]+}}/g;
  let match: RegExpExecArray | null;
  let lastIndex = 0;
  let remainingText = props.modelValue ?? '';

  while ((match = regex.exec(remainingText)) !== null) {
    if (match.index > lastIndex) {
      delta.insert(remainingText.slice(lastIndex, match.index));
    }
    delta.insert({ [EmbedBlot.blotName]: match[0].slice(2, -2) });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < remainingText.length) {
    delta.insert(remainingText.slice(lastIndex));
  }
  return delta
})

function setQuillContent(quillInstance: Quill, delta: Delta) {
  if (!quillInstance) return

  // Store the current selection (cursor position)
  const selection = quillInstance.getSelection();

  // Update the contents
  quillInstance.setContents(delta, 'silent')

  // Restore the cursor position if it exists
  if (selection) {
    quillInstance.setSelection(selection.index, selection.length, 'silent');
  }
}

watch([quillInstance, delta], ([_quillInstance, _delta]) => setQuillContent(_quillInstance, _delta), { immediate: true })
//#endregion
//#endregion


function insertEmbed(embedLabel: string) {
  if (!quillInstance.value || !quillInstance.value.getSelection(true)) return;

  let index = quillInstance.value.getSelection().index;

  /**
   * Step 1: Insert space before if needed
   * - `textBefore` relative to embed
   * - 160 - &nbsp; - non breaking space
   * - 32 - ' ' - space
   */
  const textBefore = quillInstance.value.getText();
  if (index > 0 && ![160, 32].includes(textBefore.charCodeAt(index - 1))) {
    quillInstance.value.insertText(index, String.fromCharCode(160), 'user');
    // quillInstance.value.insertText(index, String.fromCharCode(32), 'user');
    index += 1;
  }

  /**
   * Step 2: Insert the embed
   */
  quillInstance.value.insertEmbed(index, EmbedBlot.blotName, embedLabel, 'user');

  /**
   * Step 3: Insert space after and set cursor
   * - `textAfter` relative to embed and including embed as 1 "unit" in length
   * - `embedLenght` - embeds are 1 "unit" in Quill's Delta
   */
  const textAfter = quillInstance.value.getText();
  const embedLength = 1;
  const nextIndex = index + embedLength;

  if (![160, 32].includes(textAfter.charCodeAt(index))) {
    quillInstance.value.insertText(nextIndex, String.fromCharCode(160), 'user');
  }
  quillInstance.value.setSelection(nextIndex + 1, 0, 'user');
}
</script>


<template>
  <div>
    <div
      ref="editorRef"
      class="quill-editor p-inputtext p-variant-filled"
    ></div>
    <AppButton
      :label="embedDropdownLabel ?? 'Add variable'"
      variant="text"
      @click="menuRef!.toggle($event);"
      icon="pi pi-angle-down"
      iconPos="right"
      class="mt-1"
      aria-haspopup="true"
      aria-controls="overlay_menu"
    />
    <Menu
      ref="menuRef"
      id="overlay_menu"
      :model="_embedItems"
      :popup="true"
    >
      <template #start>
        <span class="block border-bottom-1 p-2 px-3 text-primary-500">{{ embedDescription ?? 'Injected variable will be computed and visible to end-users.' }}</span>
      </template>
    </Menu>

    <!-- Workaround for using InputText styles on Quill editor. More info on why this is required in the following links:
        - https://github.com/orgs/primefaces/discussions/2158
        - https://github.com/primefaces/primevue/issues/6678
        - https://github.com/orgs/primefaces/discussions/2436
    -->
    <InputText v-show="false"></InputText>
  </div>
</template>


<style lang="scss" scoped>
:deep(.embed-blot) {
  background-color: #e0e0e0;
  border-radius: 16px;
  font-family: monospace;
  font-size: 0.85rem;
  letter-spacing: 0.05rem;
  color: var(--p-orange-500);
  padding: 2px 8px;
  margin: 0 2px;
  display: inline-flex;
  align-items: center;
}

:deep(.ql-editor:focus-visible) {
  outline: none;
}

:deep(.quill-editor) {
  min-height: 2.5rem;

  .ql-editor:focus-visible {
    outline: none;
  }

  p {
    margin: 0;
  }
}

// @TT TODO: Support multi-line and single-line style
// :deep(.quill-editor) {
//   /* Prevent text wrapping */
//   white-space: nowrap;
//   /* Enable horizontal scrolling for overflow */
//   overflow-x: auto;
//   /* Hide vertical overflow or scrolling */
//   overflow-y: hidden;
//   /* Optional: Match typical input height */
//   height: 1.5em; /* Adjust as needed */
//   line-height: 1.5em;
//   /* Ensure content stays within bounds */
//   max-height: 1.5em;
  
//   /* Target Quill's content area */
//   .ql-editor {
//     padding: 0 8px; /* Match input padding, adjust as needed */
//     white-space: nowrap;
//     overflow-x: auto;
//     overflow-y: hidden;
//     height: 100%;
//   }
// }
</style>