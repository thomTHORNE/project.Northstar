<script setup lang="ts">
import { useDropZone, useMouseInElement } from "@vueuse/core";
import { computed, ComputedRef, nextTick, Ref, ref, toRef, watch, WatchStopHandle } from "vue";

import { parseHTML } from "@/common/utilities/domManipulation";
import { useAppUi } from "@/common/composables/services/useAppUi";
import { findRecursively } from "@/common/utilities/findRecursively";
import { useCancellableAction } from "@/common/composables/utilities/useCancellableAction";
import { TransitionName, useWaitForTransition } from "@/common/composables/utilities/useWaitForTransition";

import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
import OverlayPanel from 'primevue/overlaypanel';
import Tree, { TreePassThroughMethodOptions } from "primevue/tree";
import type { TreeNode } from "primevue/treenode";
import { doRx } from "@/common/composables/reactivity/doRx";
import { TOAST_LIFE } from "@/common/constants/toastLife";
import { CmsTreeViewDropPosition, CmsTreeViewDropRequest } from "@/common/contracts/cmsTree";

const prop = defineProps<{
  nodes: TreeNode[],
  selectionKey?: Record<string, boolean>,
  draggable?: boolean,
  lockOnEndpoints?: string[]
}>();

const emit = defineEmits<{
  "update:selectionKey": [value: Record<string, boolean>],
  "newChild": [value: number],
  "drop": [value: CmsTreeViewDropRequest],
}>()

const { computeLockState } = useAppUi();
const toast = useToast();

function getParentNodeLabel( id: number ) {
  return findRecursively<TreeNode>( internalValue.value, "children", 'key', id.toString() )?.item.label ?? " - ";
}
/**
 * The data source to which DraggableTree applies node position and expansion changes. 
 * 
 * NOTE: This declaration is not limited to its behavior (i.e., the subscribe method), 
 * but it is also updated imperatively throughout this component.
 */
const internalValue = doRx<TreeNode[]>([]).subscribe(() => prop.nodes, { immediate: true })

/**
 * A readonly value of a selected key to control the selection state. Currently supporting only single selection. 
 */
const selectionKeys = computed(() => prop.selectionKey ?? {})

const expandedKeysByToggler: Ref<Record<string, boolean>> = ref( {} );

/**
 * An updated record of expanded keys by the user. Actions that are considered to be user-driven are:
 * * clicking the node toggle button
 * * hovering over a node while dragging
 * * placing a node over another node
 * * moving a node under another node using parent selector
 */
const expandedKeysByUser: Ref<Record<string, boolean>> = ref( {} );

const latestExpandedKeys = doRx<Record<string, boolean>>()
.subscribe(expandedKeysByUser)
.subscribe(expandedKeysByToggler)
.subscribe(selectionKeys, ({ incoming }) => Object.keys( incoming ).map( key => findRecursively<TreeNode>( prop.nodes, "children", "key", key.toString() ) )[0]?.path ?? {})

const expandedKeys: ComputedRef<Record<string, boolean>> = computed( () => {
  const initialExpandedKeys: Readonly<Record<string, boolean>> = {
    ...setAllExpandState( internalValue.value, false ),
    ...Object.keys( prop.selectionKey ?? {} ).map( key => findRecursively<TreeNode>( prop.nodes, "children", "key", key.toString() ) )[0]?.path ?? {}
  };

  const computedValue = {
    ...expandedKeys.value,
    ...latestExpandedKeys.value,
  }

  return Object.keys( expandedKeys.value ?? {} ).length > 0 ? computedValue : { ...initialExpandedKeys }
} );

watch( expandedKeys, value => {
  if (prop.draggable) {
    applyDropZones();
    applyExpandOnHover();
    removeTrailingDropZones();
  }
}, { flush: 'post' } )

/**
 * Created after `draggingElement`; second value in line for the dragging feature. 
 */
const moveEvent: Ref<{
  source: TreeNode,
  destination: TreeNode,
  position: CmsTreeViewDropPosition
} | undefined> = ref();

watch( moveEvent, value => {
  const emitValue = {
    sourceId: Number( value!.source.key ),
    destinationId: Number( value!.destination.key ),
    position: value!.position
  }

  if (value!.position === CmsTreeViewDropPosition.Over) {
    expandedKeysByUser.value = {
      [value!.destination.key!]: true
    }
  }

  emit( "drop", emitValue )
} )

// @TT missing type, what is this???
const selectionKeyUpdate = ref();
// @TT missing type, what is this???
const targetNode = doRx()
  .subscribe(moveEvent, ({ incoming }, { ref }) => ref.value = incoming?.source.key)
  .subscribe(selectionKeyUpdate, ({ incoming }, { ref } ) => ref.value = Object.keys( incoming ?? {} )[0])

const uiLocked = computeLockState( toRef( () => prop.lockOnEndpoints ) );

watch( uiLocked, value => {
  const sourceNodeIconElement = document.querySelector(`.p-tree-node-content[data-nodeid="${targetNode.value}"] .p-tree-node-icon`);
  const treeItems = document.querySelectorAll('.p-tree-node-content');

  if (value) {
    sourceNodeIconElement?.classList.add('pi', 'pi-spin', 'pi-spinner', 'text-primary', 'text-xl')
    nextTick(() => {
      treeItems.forEach(element => {
        if ((element as HTMLElement).dataset.nodeid === targetNode.value) {
          element.classList.add('is-loading')
        } else {
          element.classList.add('is-disabled')
        }
      });
    })

  } else {
    sourceNodeIconElement?.classList.remove('pi', 'pi-spin', 'pi-spinner', 'text-primary', 'text-xl')
    treeItems.forEach(element => element.classList.remove('is-loading', 'is-disabled'))
  }
})

/**
 * The first value in line for the dragging feature.
 */
const draggingElement = ref();
const treePassthrough = {
  node: (options: TreePassThroughMethodOptions) => ({
    'dropzoneposition': CmsTreeViewDropPosition.Over,
    class: 'py-1'
  }),
  nodeContentToggleButton: {
    'disabled': uiLocked.value ? "true" : null
  },
  nodeContent: (options: TreePassThroughMethodOptions) => ({
    'data-nodeid': options.instance.node.key,
    'ondragstart': (dragEvent: DragEvent) => {
      draggingElement.value = dragEvent.target as HTMLElement;
      dragEvent.dataTransfer!.setData('utf-8', draggingElement.value.dataset.nodeid);
    },
    'ondragend': () => draggingElement.value = undefined,
    draggable: prop.draggable ? 'true' : false
  }),
  nodeChildren: (options: TreePassThroughMethodOptions) => ({
    'data-nodeid': options.instance.node.key,
    class: 'py-1 indent-child-node relative'
  }),
  label: () => ({
    class: 'w-full'
  }),
  hooks: {
    onMounted: () => {
      if (prop.draggable) {
        applyDropZones();
        applyExpandOnHover();
      }
    }
  }
}

function removeTrailingDropZones() {
  ([...document.querySelectorAll("li.p-tree-node:not(.p-tree-node-leaf)")] as HTMLElement[]).forEach(nodeElement => {
    const isParentNode = nodeElement.querySelector('ul');
    const adjacentDropZones = nodeElement.querySelectorAll('.drop-zone');

    if (isParentNode && adjacentDropZones[1]) {
      adjacentDropZones[1].remove()
    }
  })
}

function applyExpandOnHover() {
  ([...document.querySelectorAll("li.p-tree-node:not(.p-tree-node-leaf)")] as HTMLElement[]).forEach(nodeElement => {
    const nodeContent = (nodeElement.querySelector('.p-tree-node-content') as HTMLElement);
    const isExpandableApplied = nodeContent.dataset.isexpandable;
    const nodeId = nodeContent.dataset.nodeid!;

    if (!isExpandableApplied) {
      nodeContent.dataset.isexpandable = "true";

      const elementRef = ref(nodeContent)
      const { isOutside } = useMouseInElement(elementRef);
      const isHovering = computed(() => !isOutside.value && draggingElement.value && (draggingElement.value !== nodeContent));
      let innerActionStopHandle: WatchStopHandle;

      useCancellableAction(isHovering,
        () => {
          const isCollapsed = nodeElement.getAttribute('aria-expanded') !== "true";

          if (isCollapsed) {
            nodeContent.classList.add('pulse-for-expand');

            innerActionStopHandle = useCancellableAction(isHovering,
              () => {
                nodeContent.classList.remove('pulse-for-expand');

                expandedKeysByUser.value = {
                  ...expandedKeysByUser.value,
                  [nodeId]: true
                };
              },
              () => null,
              {
                interval: 400,
                immediate: true
              })
          }
        },
        () => {
          innerActionStopHandle?.();
          nodeContent.classList.remove('pulse-for-expand');
        }
      )
    }
  })
}

function applyDropZones() {
  ([...document.querySelectorAll("li.p-tree-node")] as HTMLElement[]).forEach(nodeElement => {
    const nodeContent = (nodeElement.querySelector('.p-tree-node-content') as HTMLElement);
    const isDropZoneApplied = nodeContent.dataset.isdropzone;

    if (!isDropZoneApplied) {
      nodeContent.dataset.isdropzone = "true";

      createDropZone(nodeContent, {
        onDrop: (event, nodeId, destinationId) => isMovingAllowed(nodeId, destinationId, CmsTreeViewDropPosition.Over) && moveNode(nodeId, destinationId, CmsTreeViewDropPosition.Over)
      })

      const elementRef = ref(nodeElement)
      const { isOutside } = useMouseInElement(elementRef);
      const isHovering = computed(() => !isOutside.value && draggingElement.value && (draggingElement.value !== nodeContent));

      watch(isHovering, value => {
        if (value) {
          // const isParentNode = nodeElement.querySelector( 'ul' );
          const createHtmlString = (nodeId: string, dropZonePosition: CmsTreeViewDropPosition) => `<div class="drop-zone" data-isdropzone="true" data-nodeid="${nodeId}" data-dropzoneposition="${dropZonePosition}"></div>`

          const dropZoneBefore = parseHTML(createHtmlString(nodeContent.dataset.nodeid!, CmsTreeViewDropPosition.Before));
          const dropZoneAfter = parseHTML(createHtmlString(nodeContent.dataset.nodeid!, CmsTreeViewDropPosition.After));

          const dropZones = [[dropZoneBefore, "afterbegin"], [dropZoneAfter, "beforeend"]].filter(dropZone => Boolean(dropZone[0])) as [HTMLElement, InsertPosition][];
          dropZones.forEach(dropZone => renderAdjacentDropZone(nodeElement, dropZone[0], dropZone[1]));

        } else {
          // NOTE: :scope matches the element on which the method was called.
          nodeElement.querySelectorAll<HTMLElement>(':scope > .drop-zone').forEach(item => {
            removeDropZone(item)
          })
        }
      })
    }

  })
}

function renderAdjacentDropZone(nodeElement: HTMLElement, dropZone: HTMLElement, position: InsertPosition) {
  nodeElement.insertAdjacentElement(position, dropZone);
  setTimeout(() => dropZone.classList.add("drop-zone-scale-up"), 0);
  createDropZone(dropZone, {
    onDrop: (event, sourceId, destinationId) => {
      isMovingAllowed(sourceId, destinationId, dropZone.dataset.dropzoneposition) && moveNode(sourceId, destinationId, dropZone.dataset.dropzoneposition);
    }
  })
}

// NOTE: If user drags over many drop zones too quickly, the browser sometimes doesn't remove them after animation is done, so we have to check for an existing class.
function removeDropZone(dropZone: HTMLElement) {
  if (dropZone.classList.contains('drop-zone-scale-up')) {
    useWaitForTransition(TransitionName.TransitionEnd, dropZone, ["padding-bottom"], () => dropZone.remove())
    dropZone.classList.remove('drop-zone-scale-up');
  } else {
    dropZone.remove()
  }
}

function createDropZone(element: HTMLElement, callback: {
  onDrop?: (event: DragEvent, sourceId?: string, destinationId?: string) => void
} = {}) {
  const { isOverDropZone } = useDropZone(element, {
    onDrop: (file, event) => {
      (getDropZoneElement(event) ?? event.target as HTMLElement).classList.remove('drop-zone-active');

      const sourceId = event.dataTransfer.getData('utf-8');
      const destinationId = element.dataset.nodeid;
      callback.onDrop?.(event, sourceId, destinationId);

      nextTick(() => {
        applyDropZones()
      })
    }
  });

  watch(isOverDropZone, _isOverDropZone => {
    if (_isOverDropZone) element.classList.add('drop-zone-active')
    else element.classList.remove('drop-zone-active')
  })
}

const getDropZoneElement = (event: Event) => {
  const typedEventTarget = (event.target as HTMLElement);
  return typedEventTarget.dataset.nodeid ? typedEventTarget : typedEventTarget.closest('.p-tree-node-content[data-nodeid]') as HTMLElement
};

function isMovingAllowed( sourceId: string, destinationId: string, position: CmsTreeViewDropPosition ) {
  const target = findRecursively( internalValue.value, "children", "key", destinationId );
  const blacklist = {
    dropOnSelf: () => sourceId === destinationId,
    hierarchyViolation: () => {
      const result = Object.keys( target?.path ).includes( sourceId );
      if (result) {
        toast.add( {
          severity: "error",
          summary: "Action not allowed!",
          detail: "Hierarchy violation.",
          life: TOAST_LIFE
        } );
      }
      return result
    }
  }

  return Object.values( blacklist ).every( validator => validator() === false )
}

function moveNode( sourceId: string, destinationId: string, position: CmsTreeViewDropPosition ) {
  const destination = findRecursively<TreeNode>( internalValue.value, "children", "key", destinationId );
  const source = findRecursively<TreeNode>( internalValue.value, "children", "key", sourceId );
  const removedObject = source?.scope.splice( source?.index, 1 )[0];

  if ((destination?.index != undefined) && !!removedObject) {
    if (position === CmsTreeViewDropPosition.Before) {
      const spliceDirection = source.index < destination.index ? 1 : 0
      destination?.scope.splice( destination.index - spliceDirection, 0, removedObject )
    }
    if (position === CmsTreeViewDropPosition.Over) {
      destination?.item.children?.unshift( removedObject )
    }
    if (position === CmsTreeViewDropPosition.After) {
      const spliceDirection = source?.index < destination.index ? 0 : 1
      destination?.scope.splice( destination.index + spliceDirection, 0, removedObject )
    }

    moveEvent.value = {
      source: source.item,
      destination: destination.item,
      position
    }
  }
}


/**
 * =================
 * [ Overlay logic ]
 */
const overlayPanel = ref();
const parentSelectionInternalValue: Ref<TreeNode[]> = ref( prop.nodes );
const expandedParentSelectionKeys = ref( {} );

const parentSelectionButtonEvent: Ref<{ nodeId: number, parentId: number } | undefined> = ref();
const parentSelectionKeys = computed( {
  get: () => {
    const target = findRecursively<TreeNode>( internalValue.value, "children", "key", parentSelectionButtonEvent.value?.parentId.toString() );
    const existingParent = target ? {
      [target.item.key as string]: true
    } : {};

    return existingParent
  },
  set: value => {
    const sourceId = parentSelectionButtonEvent.value!.nodeId.toString();
    const destinationId = Object.keys( value )[0]

    if (isMovingAllowed( sourceId, destinationId, CmsTreeViewDropPosition.Over )) {
      moveNode( sourceId, destinationId, CmsTreeViewDropPosition.Over )

      expandedKeysByUser.value = {
        ...findRecursively<TreeNode>( prop.nodes, "children", "key", destinationId ).path,
        [destinationId]: true
      };
    }
  }
} );

const parentSelectionTreePassthrough = {
  root: ( options: TreePassThroughMethodOptions ) => {
    if (options.instance.filterValue === null) options.instance.filterValue = "";
    parentSelectionInternalValue.value = options.instance.filteredValue ?? [];
  },
  nodeChildren: (options: TreePassThroughMethodOptions) => ({
    class: 'relative'
  })
}

function toggleExpandState( array: TreeNode[], toggler: HTMLElement ) {
  if (toggler.textContent === "Expand all") {
    toggler.textContent = "Collapse all";
    return setAllExpandState( array, true )
  } else {
    toggler.textContent = "Expand all";
    return setAllExpandState( array, false )
  }
}

function setAllExpandState( nodes: TreeNode[], value: boolean ) {
  return nodes.reduce( ( target, current ) => {
    
    
    Object.assign( target, { [current.key!]: value } );
    if (current.children) Object.assign( target, setAllExpandState( current.children, value ) )
    return target
  }, {} )
}

function bypassBubblingPhase( fn: () => void ) {
  setTimeout( () => fn(), 0 )
}
</script>


<template>
  <div class="flex justify-content-between">
    <slot/>
    <div class="test align-self-center">
      <Button label="Expand all" class="m-2 px-2 py-1"
              :disabled="uiLocked"
              @click="expandedKeysByToggler = toggleExpandState(internalValue, $event.target! as HTMLElement)"
              :pt="{ label: { class: 'font-normal' }}" severity="secondary" outlined/>
    </div>
  </div>

  <Tree
      :selection-keys="selectionKeys"
      @update:selection-keys="selectionKeyUpdate = $event; emit( 'update:selectionKey', $event )"
      :expanded-keys="expandedKeys"
      @update:expanded-keys="expandedKeysByUser = $event"
      :value="internalValue"
      :pt="treePassthrough"
      selection-mode="single">

    <template #default="slotProps">
      <div class="flex align-items-baseline">
        <span class="text-lg">{{ slotProps.node.label }}</span>

        <div class="flex flex-row-reverse p-0 col justify-content-between">
          <div v-if="Object.keys(selectionKeys).includes(slotProps.node.key)" class="flex flex-order-1">
            <Button label="New child" :pt="{ label: { class: 'font-medium' }}" class="ml-3 px-2 p-1" size="small"
                    :disabled="uiLocked"
                    @click="bypassBubblingPhase(() => emit( 'newChild', Number(Object.keys(selectionKeys)[0]) ) )"
                    outlined/>
            <Button icon="pi pi-trash" class="ml-2 p-1" severity="danger" outlined :disabled="uiLocked"/>
          </div>

          <Button :label="getParentNodeLabel(slotProps.node.data.parentID)"
                  :pt="{ label: { class: 'font-normal' }}" class="ml-3 px-2 p-1"
                  style="min-width: 3rem"
                  severity="secondary"
                  size="small"
                  outlined
                  :disabled="uiLocked"
                  v-tooltip.top="getParentNodeLabel(slotProps.node.data.parentID)"
                  @click="overlayPanel.toggle( $event ); parentSelectionButtonEvent = { nodeId: slotProps.node.data.id, parentId: slotProps.node.data.parentID }"/>
        </div>
      </div>


    </template>
    <!--    <template #drop="slotProps">-->
    <!--      <li class="drop-zone "></li>-->
    <!--    </template>-->
  </Tree>

  <OverlayPanel ref="overlayPanel" appendTo="body" :pt="{ content: { class: 'p-0 border-none' }}"
                @hide="expandedParentSelectionKeys = setAllExpandState(parentSelectionInternalValue, false)">
    <div class="flex align-items-baseline justify-content-between"><span
        class="block m-4 mb-0">Choose a parent</span>
      <Button label="Expand all" class="m-2 mr-4 px-2 py-1"
              @click="expandedParentSelectionKeys = toggleExpandState(parentSelectionInternalValue, $event.target! as HTMLElement)"
              :pt="{ label: { class: 'font-normal' }}" severity="secondary" outlined/>
    </div>

    <Tree v-model:selectionKeys="parentSelectionKeys"
          :expanded-keys="expandedParentSelectionKeys"
          :value="internalValue"
          :filter="true"
          @node-select="overlayPanel.toggle()"
          filterMode="lenient"
          filterPlaceholder="Search"
          selectionMode="single"
          :pt="parentSelectionTreePassthrough"
          class="w-full md:w-30rem pt-2"/>
  </OverlayPanel>
</template>


<style scoped lang="scss">
:deep(.is-disabled),
:deep(.is-loading) {
  touch-action: none;
  pointer-events: none;
}

:deep(.is-loading) {
  background: var(--primary-100) !important;;
}

html.dark * {
  :deep(.is-loading) {
    background: var(--bluegray-700) !important;
    color: #ffffff;
  }
}

:deep(.is-disabled) {
  opacity: 0.7;
}

:deep(.drop-zone) {
  border-radius: 3px;
  height: 1px;

  padding-top: 0;
  padding-right: 0;
  padding-bottom: 0;
  padding-left: 0;
  transition: padding-top 0.3s ease, padding-right 0.3s ease, padding-bottom 0.3s ease, padding-left 0.3s ease, background-color 0.3s ease;
}

:deep(.drop-zone-active) {
  border: 1.5px dashed #3eafff;
  background-color: #3daeff1c;
}

:deep(.drop-zone-scale-up) {
  padding-top: 0.5rem;
  padding-right: 0;
  padding-bottom: 0.5rem;
  padding-left: 0;
}

:deep(.p-tree-node-children:before) {
  content: '';
  position: absolute;
  transform: translate(1px, 0);
  height: 99%;
  border-left: 1.5px solid rgba(0, 0, 0, 0.12);
}

html.dark * {
  :deep(.p-tree-node-children:before) {
    border-left: 1.5px solid rgba(255, 255, 255, 0.2);
  }
}

:deep(.indent-child-node) {
  transform: scale(0.993);
  transform-origin: right;
}

:deep(.pulse-for-expand) {
  animation: pulse .3s ease-in-out;
  animation-iteration-count: infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 1;
  }
}
</style>