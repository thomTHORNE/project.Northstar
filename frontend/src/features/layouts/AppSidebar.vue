<script setup lang="ts">
import { type Ref, ref } from 'vue';
import { useRouter } from 'vue-router';

import { ROUTE_META } from "@/common/constants/routeMeta";
import { Warmth, useAppUi } from '@/common/composables/services/useAppUi';
import { useHttpClient } from "@/common/composables/services/useHttpClient";

import Menu from 'primevue/menu';
import Badge from 'primevue/badge';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import Accordion from 'primevue/accordion';
import { type MenuItem } from 'primevue/menuitem';
import ButtonGroup from 'primevue/buttongroup';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import { ToggleSwitch } from 'primevue';

const { toggleTheme, toggleWarmth, setAppFontSize, state } = useAppUi();
const router = useRouter()

const items: Ref<MenuItem[]> = ref([
    // {
    //     separator: true
    // },
    {
        label: 'Edit',
        items: [
            // {
            //     label: 'Category',
            //     icon: 'pi pi-plus',
            //     route: '/edit/category'
            //     // shortcut: '⌘+N'
            // },
            // {
            //     label: 'Document',
            //     icon: 'pi pi-search',
            //     route: '/edit/document'
            //     // shortcut: '⌘+S',
            //     // badge: 2
            // }
        ],
    },
    // {
    //     separator: true
    // }
]);



const logoutApi = useHttpClient('auth/logout', { immediate: false })
function signOut() {
    logoutApi.execute();
    router.push({ name: ROUTE_META.login.name })
}
</script>


<template>
    <aside class="VPSidebar">
        <!-- <div class="curtain"></div> -->
        <nav>
            <div class="group">
                <Menu
                    :model="items"
                    class="w-full md:w-60"
                >
                    <template #start>
                        <div class="menu-header">
                            <button class="avatar">
                                <Avatar
                                    image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
                                    class="mr-2"
                                    shape="circle"
                                />
                                <span class="align-items-start flex-column inline-flex">
                                    <span class="font-bold">Amy Elsner</span>
                                    <span class="text-sm">Admin</span>
                                </span>
                            </button>
                            <div class="p-menu-item-content">
                                <a
                                    @click="signOut()"
                                    class="p-menu-item-link"
                                >
                                    <span class="pi pi-sign-out"></span>
                                    <span class="ml-2">Sign out</span>
                                </a>
                            </div>
                        </div>
                    </template>

                    <!-- <template #submenuitem="{ item }">
                        <span class="text-primary font-bold">{{ item.label }}</span>
                    </template> -->
                    <template #item="{ item, props }">
                        <router-link
                            v-if="item.route"
                            :to="item.route"
                            :class="[
                                'p-menu-item-link',
                                {
                                    'router-link-active':
                                        ($route.path.startsWith(item.route) &&
                                            item.route !== '/')
                                }
                            ]"
                        >
                            <!-- <a
                                :href="href"
                                v-bind="props.action"
                                @click="navigate"
                            > -->
                            <span
                                v-if="item.icon"
                                :class="item.icon + ' mr-2'"
                            />
                            <span>{{ item.label }}</span>
                            <Badge
                                v-if="item.badge"
                                class="ml-auto"
                                :value="item.badge"
                            />
                            <span
                                v-if="item.shortcut"
                                class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1"
                            >{{ item.shortcut }}</span>
                            <!-- </a> -->
                        </router-link>
                        <a
                            v-else
                            :href="item.url"
                            :target="item.target"
                            v-bind="props.action"
                        >
                            <span :class="item.icon" />
                            <span class="ml-2">{{ item.label }}</span>
                            <Badge
                                v-if="item.badge"
                                class="ml-auto"
                                :value="item.badge"
                            />
                            <span
                                v-if="item.shortcut"
                                class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1"
                            >{{ item.shortcut }}</span>
                        </a>
                    </template>
                </Menu>

                <div class="menu-footer">
                    <Accordion>
                        <AccordionPanel value="0">
                            <AccordionHeader>Accessibility</AccordionHeader>
                            <AccordionContent>
                                <div class="align-items-center flex justify-content-between mb-3">
                                    <span class="text-primary">Theme</span>
                                    <ToggleSwitch
                                        :model-value="state.appDarkTheme"
                                        @update:model-value="toggleTheme()"
                                    >
                                        <template #handle="{ checked }">
                                            <i :class="['text-xs pi', { 'pi-moon': checked, 'pi-sun': !checked }]" />
                                        </template>
                                    </ToggleSwitch>
                                </div>

                                <div class="align-items-center flex justify-content-between mb-3">
                                    <span class="text-primary">Warmth</span>
                                    <ToggleSwitch
                                        :model-value="state.warmth"
                                        @update:model-value="toggleWarmth()"
                                        :true-value="Warmth.Solarized"
                                        :false-value="Warmth.Overcast"
                                    >
                                        <template #handle="{ checked }">
                                            <i
                                                :class="['text-xs pi', { 'pi-lightbulb': checked, 'pi-cloud': !checked }]" />
                                        </template>
                                    </ToggleSwitch>
                                </div>

                                <div class="align-items-center flex justify-content-between mb-3">
                                    <span class="text-primary">Text</span>
                                    <ButtonGroup>
                                        <Button
                                            @click="setAppFontSize(state.appFontSize - 1)"
                                            icon="pi pi-minus"
                                            size="small"
                                            outlined
                                        />
                                        <Button
                                            @click="setAppFontSize()"
                                            icon="pi pi-refresh"
                                            size="small"
                                            outlined
                                        />
                                        <Button
                                            @click="setAppFontSize(state.appFontSize + 1)"
                                            icon="pi pi-plus"
                                            size="small"
                                            outlined
                                        />
                                    </ButtonGroup>
                                </div>
                                <!-- 
                <div class="align-items-center flex justify-content-between mb-3">
                    <span class="text-primary">Compact</span>
                </div> -->
                            </AccordionContent>
                        </AccordionPanel>
                    </Accordion>
                </div>
            </div>
        </nav>
    </aside>
</template>


<style lang="scss" scoped>
.menu-header {
    background: var(--p-menu-separator-border-color);
    border-radius: var(--p-menu-item-border-radius);
    padding: .5rem;
    padding-left: 1rem;
}

.avatar {
    border-style: solid;
    box-sizing: border-box;
    position: relative;
    display: flex;
    width: 100%;
    // cursor: pointer;
    align-items: flex-start;
    overflow: hidden;
    // border-radius: var(--p-menu-item-border-radius);
    border-width: 0;
    background-color: transparent;
    padding-block: .5rem;
    // padding-left: 1rem;
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
    transition-timing-function: cubic-bezier(.4, 0, .2, 1);
    transition-duration: .2s;
}

.avatar:hover {
    // background: var(--p-menu-separator-border-color);
}

.VPSidebar {
    position: fixed;
    // top: var(--vp-layout-top-height, 0px);
    top: 0px;
    bottom: 0;
    left: 0;
    // z-index: var(--vp-z-index-sidebar);
    padding: 32px 32px 96px;
    width: calc(100vw - 64px);
    max-width: 320px;
    background-color: var(--p-navigation-sidebar-background);
    opacity: 0;
    box-shadow: var(--vp-c-shadow-3);
    overflow-x: hidden;
    overflow-y: auto;
    transform: translate(-100%);
    transition: opacity .5s, transform .25s ease;
    overscroll-behavior: contain;
}

@include break-at(md) {
    .VPSidebar {
        padding-top: var(--p-navigation-navbar-height);
        width: var(--p-navigation-sidebar-width);
        max-width: 100%;
        background-color: var(--p-navigation-sidebar-background);
        opacity: 1;
        visibility: visible;
        box-shadow: none;
        transform: translate(0);
    }
}


@include break-at(xl) {
    .VPSidebar {
        padding-left: max(32px, calc((100% - (var(--p-content-max-width) - 64px)) / 2));
        width: calc((100% - (var(--p-content-max-width) - 64px)) / 2 + var(--p-navigation-sidebar-width) - 32px);
    }
}

// @include break-at(md) {
//     .curtain {
//         position: sticky;
//         top: -64px;
//         left: 0;
//         z-index: 1;
//         margin-top: calc(var(--p-navigation-navbar-height) * -1);
//         margin-right: -32px;
//         margin-left: -32px;
//         height: var(--p-navigation-navbar-height);
//         background-color: var(--p-navigation-sidebar-background);
//     }
// }

.group {
    // margin-top: 0.5rem;
}

@include break-at(md) {
    .group {
        width: calc(var(--p-navigation-sidebar-width) - 64px);
    }
}

:deep(.p-menu) {
    background: transparent;
    border-color: transparent;
}

:deep(.p-menu-list) {
    gap: 0;
}

:deep(.p-menu-submenu-label) {
    color: var(--p-text-color);
    --p-menu-submenu-label-padding: 0.6rem 0 0.5rem 0;
    // padding: 0.5rem 0.75rem;
}

:deep(.p-menu-item) {
    // --p-focus-ring-offset: -1px;
    left: 3px;
    align-items: center;
    border-left: 1px solid var(--p-surface-300);
    // color: var(--text-secondary-color);
    display: flex;
    // font-weight: 450;
    outline-color: transparent;
    padding: 0.2rem 0rem 0.2rem 0.7rem;
    position: relative;
    transition: all .2s;
    transition: outline-color .2s, border-color .2s;
}

.app-dark-theme div:deep(.p-menu-item) {
    border-left: 1px solid var(--p-surface-600);
}

:deep(.p-menu-item-content) {
    width: 100%;
}

.app-dark-theme div:deep(.p-menu-item-content:has(.router-link-active)) {
    background-color: var(--p-surface-500);
}

div:deep(.p-menu-item-content:has(.router-link-active)) {
    background-color: var(--p-surface-200);
}

:deep(.p-menu-item:hover) {
    border-left: 2px solid var(--p-surface-400);
}

div:deep(.p-menu-item:has(.router-link-active)) {
    border-left: 2px solid var(--p-surface-500);
}

.app-dark-theme div:deep(.p-menu-item:hover) {
    border-left: 2px solid var(--p-surface-400);
}

.app-dark-theme div:deep(.p-menu-item:has(.router-link-active)) {
    border-left: 2px solid var(--p-surface-200);
}

:deep(.p-menu-separator) {
    margin-top: 1.4rem;
}

.menu-footer {
    position: fixed;
    bottom: 0;
    padding-right: 1.5rem;
    width: stretch;
    width: -webkit-fill-available;
    width: -moz-available;
}






.VPNavBarAppearance {
    display: none;
}

@include break-at(sm) {
    .VPNavBarAppearance {
        display: flex;
        align-items: center;
    }
}

.VPSwitch:hover {
    border-color: var(--p-form-field-hover-border-color);
}


.VPSwitch {
    cursor: pointer;
    position: relative;
    border-radius: 11px;
    display: block;
    width: 40px;
    height: 22px;
    flex-shrink: 0;
    border: 1px solid var(--p-form-field-border-color);
    background-color: var(--p-surface-200);
    transition: border-color .25s !important;
}

.app-dark-theme .VPSwitch {
    background-color: var(--p-surface-800);
}

.vpi-sun,
.vpi-moon {
    -webkit-mask: var(--icon) no-repeat;
    mask: var(--icon) no-repeat;
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
    background-color: currentColor;
    color: inherit;
}

.vpi-sun {
    --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='4'/%3E%3Cpath d='M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41'/%3E%3C/svg%3E")
}

.vpi-moon {
    --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'/%3E%3C/svg%3E")
}


.app-dark-theme .VPSwitch .check {
    transform: translate(18px);
    background-color: var(--p-surface-900);
}

.check {
    position: absolute;
    top: 1px;
    left: 1px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: var(--p-surface-0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, .04), 0 1px 2px rgba(0, 0, 0, .06);
    transition: transform .25s !important;
}

.icon {
    position: relative;
    display: block;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    overflow: hidden;
}

.app-dark-theme .icon [class^=vpi-] {
    transition: opacity .25s !important;
}

.moon,
.app-dark-theme .sun {
    opacity: 0;
}

.icon [class^=vpi-] {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 12px;
    height: 12px;
    color: var(--p-text-color);
}

.sun {
    opacity: 1;
}

[class^=vpi-],
[class*=" vpi-"],
.vp-icon {
    width: 1em;
    height: 1em;
}

.app-dark-theme .moon {
    opacity: 1;
}

// .p-button-outlined {
//     background-color: var(--p-surface-200);
// }

:deep(.p-buttongroup .p-button-outlined:hover) {
    background: var(--p-surface-50);
    color: var(--p-button-outlined-primary-color);
}

.app-dark-theme .p-button-outlined {
    background-color: var(--p-surface-800);
}

.app-dark-theme .p-button-outlined:not(:disabled):hover {
    background-color: var(--p-surface-900);
}



:deep(.p-accordionpanel) {
    border: none;
}

:deep(.p-accordionheader),
:deep(.p-accordioncontent-content) {
    background-color: transparent;
}

:deep(.p-accordionpanel:not(.p-disabled).p-accordionpanel-active > .p-accordionheader:hover) {
    color: var(--p-text-color);
}
</style>