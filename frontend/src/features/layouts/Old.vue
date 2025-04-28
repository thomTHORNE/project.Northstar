<script setup lang="ts">
import { computed, watch, ref } from 'vue';
import AppTopbar from '@/features/layouts/components/AppTopbar.vue';
import AppFooter from '@/features/layouts/components/AppFooter.vue';
import AppMenu from '@/features/layouts/components/AppMenu.vue';
import { useAppUi } from '@/common/composables/services/useAppUi';

const { layoutConfig, layoutState, isSidebarActive, resetMenu } = useAppUi();

const outsideClickListener = ref(null);

watch(isSidebarActive, (newVal) => {
    if (newVal) {
        bindOutsideClickListener();
    } else {
        unbindOutsideClickListener();
    }
});

const containerClass = computed(() => {
    return {
        'layout-overlay': layoutConfig.menuMode === 'overlay',
        'layout-static': layoutConfig.menuMode === 'static',
        'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive,
        'layout-mobile-active': layoutState.staticMenuMobileActive
    };
});

function bindOutsideClickListener() {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                resetMenu();
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
}

function unbindOutsideClickListener() {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
}

function isOutsideClicked(event) {
    const sidebarEl = document.querySelector('.layout-sidebar');
    const topbarEl = document.querySelector('.layout-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
}
</script>


<template>
  <div class="layout-wrapper" :class="containerClass">
    <AppTopbar/>
    <div class="layout-sidebar">
      <AppMenu/>
    </div>
    <div class="layout-main-container">
      <!-- <div class="flex flex-column layout-main"> -->
        <div class="layout-main">
        <RouterView/>
      </div>
      <AppFooter/>
    </div>
    <div class="layout-mask"></div>
  </div>
</template>


<style lang="scss" scoped>
.layout-sidebar {
  position: fixed;
  width: 250px;
  height: calc(100vh - 9rem);
  z-index: 999;
  overflow-y: auto;
  user-select: none;
  top: 7rem;
  left: 2rem;
  transition: transform var(--p-semantic-transition-duration), left var(--p-semantic-transition-duration);
  background-color: var(--surface-overlay);
  border-radius: var(--p-semantic-border-radius);
  padding: 0.5rem 1.5rem;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.02), 0px 0px 2px rgba(0, 0, 0, 0.05), 0px 1px 4px rgba(0, 0, 0, 0.08);
}

.layout-main-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: space-between;
  padding: 7rem 2rem 2rem 0;
  transition: margin-left var(--p-semantic-transition-duration);
}

.layout-main {
  flex: 1 1 auto;

  :deep(> div) {
    background: var(--surface-card);
    border: 1px solid var(--surface-border);
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: var(--card-shadow);
    border-radius: var(--p-semantic-border-radius);
  }
}

@media screen and (min-width: 1960px) {
  .layout-main, .landing-wrapper {
    width: 1504px;
    margin-left: auto !important;
    margin-right: auto !important;
  }

}

@media (min-width: 992px) {
  .layout-wrapper {
    &.layout-overlay {
      .layout-main-container {
        margin-left: 0;
        padding-left: 2rem;
      }

      .layout-sidebar {
        transform: translateX(-100%);
        left: 0;
        top: 0;
        height: 100vh;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }

      &.layout-overlay-active {
        .layout-sidebar {
          transform: translateX(0);
        }
      }
    }

    &.layout-static {
      .layout-main-container {
        margin-left: 300px;
      }

      &.layout-static-inactive {
        .layout-sidebar {
          transform: translateX(-100%);
          left: 0;
        }

        .layout-main-container {
          margin-left: 0;
          padding-left: 2rem;
        }
      }
    }

    .layout-mask {
      display: none;
    }
  }
}

@media (max-width: 991px) {
  .blocked-scroll {
    overflow: hidden;
  }

  .layout-wrapper {
    .layout-main-container {
      margin-left: 0;
      padding-left: 2rem;
    }

    .layout-sidebar {
      transform: translateX(-100%);
      left: 0;
      top: 0;
      height: 100vh;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    .layout-mask {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 998;
      width: 100%;
      height: 100%;
      background-color: var(--maskbg);
    }

    &.layout-mobile-active {
      .layout-sidebar {
        transform: translateX(0);
      }

      .layout-mask {
        display: block;
        animation: fadein var(--p-semantic-transition-duration);
      }
    }
  }
}
</style>