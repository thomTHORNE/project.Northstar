<script setup lang="ts">
import { computed } from 'vue';

const logoUrl = computed(() => {
    // return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
    return `/binom_logo.svg`;
});
</script>


<template>
    <header class="VPNav">
        <div class="VPNavBar has-sidebar top">
            <div class="wrapper">
                <div class="container">
                    <div class="title-container has-sidebar">
                        <div id="brand">
                            <img
                                :src="logoUrl"
                                class="block"
                                style="width: 65px;"
                            >
                            <h1 class="flex flex-column">
                                <span
                                    class="block font-bold"
                                    style="letter-spacing: -0.19rem;font-size: 2.5rem;"
                                >Element</span>
                                <span
                                    class="font-light"
                                    style="margin-top: -1.3rem;"
                                >
                                    <span style="margin-right: 0.5rem;font-size: 1.4rem;">C</span>
                                    <span style="margin-right: 0.5rem;font-size: 1.4rem;">M</span>
                                    <span style="font-size: 1.4rem;">S</span>
                                </span>
                            </h1>
                        </div>
                    </div>
                    <div class="content">
                        <div class="content-body">

                        </div>
                    </div>
                </div>
            </div>
            <div class="divider">
                <div class="divider-line"></div>
            </div>
        </div>
    </header>
</template>


<style lang="scss" scoped>
#brand {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    width: 100%;
}

.VPNav {
    position: relative;
    top: 0px;
    left: 0;
    z-index: 30;
    width: 100%;
    transition: background-color .5s;
}

@include break-at(md) {
    .VPNav {
        position: fixed;
    }
}


.VPNavBar {
    position: relative;
    height: var(--p-navigation-navbar-height);
    white-space: nowrap;
    transition: background-color .25s;
    // background-color: var(--p-navigation-navbar-background);
    background-color: transparent;
}

// @include break-at(md) {
//     .VPNavBar {
//         background-color: transparent;
//     }
// }



.wrapper {
    padding: 0 8px 0 24px;
}

@include break-at(md) {
    .VPNavBar.has-sidebar .wrapper {
        padding: 0;
    }
}

@include break-at(sm) {
    .wrapper {
        padding: 0 32px;
    }
}

@include break-at(md) {
    .VPNavBar.has-sidebar .container {
        max-width: 100%;
    }
}

.container {
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    max-width: calc(var(--p-content-max-width) - 64px);
    height: var(--p-navigation-navbar-height);
}

@include break-at(md) {
    .VPNavBar.has-sidebar .title-container {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        padding: 0 32px;
        width: var(--p-navigation-sidebar-width);
        height: var(--p-navigation-navbar-height);
        background-color: transparent;
    }
}

@include break-at(xl) {
    .VPNavBar.has-sidebar .title-container {
        padding-left: max(32px, calc((100% - (var(--p-content-max-width) - 64px)) / 2));
        width: calc((100% - (var(--p-content-max-width) - 64px)) / 2 + var(--p-navigation-sidebar-width) - 32px);
    }
}

.title-container {
    flex-shrink: 0;
    height: calc(var(--p-navigation-navbar-height) - 1px);
    transition: background-color .5s;
}


@include break-at(md) {
    .title-container.has-sidebar .title-link {
        // border-bottom-color: var(--p-content-border-color);
    }
}

@include break-at(md) {
    .title-link {
        flex-shrink: 0;
    }
}

.title-link {
    display: flex;
    align-items: center;
    // border-bottom: 1px solid transparent;
    width: 100%;
    height: var(--p-navigation-navbar-height);
    font-size: 16px;
    font-weight: 600;
    color: var(--p-text-color);
    transition: opacity .25s;
    text-decoration: none;
}

.logo {
    margin-right: 8px;
    height: 24px;
}

img {
    max-width: 100%;
    height: auto;
}

img {
    display: block;
}

@include break-at(xl) {
    .VPNavBar.has-sidebar .content {
        padding-right: calc((100vw - var(--p-content-max-width)) / 2 + 32px);
        padding-left: calc((100vw - var(--p-content-max-width)) / 2 + var(--p-navigation-sidebar-width));
    }
}

@include break-at(sm) {
    .VPNavBar.has-sidebar .content {
        position: relative;
        z-index: 1;
        padding-right: 32px;
        padding-left: var(--p-navigation-sidebar-width);
    }
}

.content {
    flex-grow: 1;
}


.content-body {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: var(--p-navigation-navbar-height);
    transition: background-color .5s;
}

// .VPNavBarAppearance {
//     display: none;
// }

// @include break-at(sm) {
//     .VPNavBarAppearance {
//         display: flex;
//         align-items: center;
//     }
// }

// .VPSwitch:hover {
//     border-color: var(--p-form-field-hover-border-color);
// }


// .VPSwitch {
//     position: relative;
//     border-radius: 11px;
//     display: block;
//     width: 40px;
//     height: 22px;
//     flex-shrink: 0;
//     border: 1px solid var(--p-form-field-border-color);
//     background-color: var(--p-surface-100);
//     transition: border-color .25s !important;
// }
// .app-dark-theme .VPSwitch {
//     background-color: var(--p-surface-800);
// }

// button{
//     cursor: pointer;
//     padding: 0;
//     font-family: inherit;
//     background-color: transparent;
//     background-image: none;
//     border: 0;
//     padding: 0;
//     line-height: inherit;
//     color: inherit;
// }

// .vpi-sun,
// .vpi-moon {
//     -webkit-mask: var(--icon) no-repeat;
//     mask: var(--icon) no-repeat;
//     -webkit-mask-size: 100% 100%;
//     mask-size: 100% 100%;
//     background-color: currentColor;
//     color: inherit;
// }

// .vpi-sun {
//     --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='4'/%3E%3Cpath d='M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41'/%3E%3C/svg%3E")
// }

// .vpi-moon {
//     --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'/%3E%3C/svg%3E")
// }


// .app-dark-theme .VPSwitchAppearance .check {
//     transform: translate(18px);
//     background-color: var(--p-surface-900);
// }

// .check {
//     position: absolute;
//     top: 1px;
//     left: 1px;
//     width: 18px;
//     height: 18px;
//     border-radius: 50%;
//     background-color: var(--p-surface-0);
//     box-shadow: 0 1px 2px rgba(0, 0, 0, .04), 0 1px 2px rgba(0, 0, 0, .06);
//     transition: transform .25s !important;
// }

// .icon {
//     position: relative;
//     display: block;
//     width: 18px;
//     height: 18px;
//     border-radius: 50%;
//     overflow: hidden;
// }

// .app-dark-theme .icon [class^=vpi-] {
//     transition: opacity .25s !important;
// }

// .moon,
// .app-dark-theme .sun {
//     opacity: 0;
// }

// .icon [class^=vpi-] {
//     position: absolute;
//     top: 3px;
//     left: 3px;
//     width: 12px;
//     height: 12px;
//     color: var(--p-text-color);
// }

// .sun {
//     opacity: 1;
// }

// [class^=vpi-],
// [class*=" vpi-"],
// .vp-icon {
//     width: 1em;
//     height: 1em;
// }

// .app-dark-theme .moon {
//     opacity: 1;
// }</style>