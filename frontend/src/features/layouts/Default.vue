<script setup lang="ts">
import AppSidebar from './AppSidebar.vue';
import AppTopbar from './AppTopbar.vue';
</script>


<template>
    <AppTopbar />
    <div class="container">
        <div class="p-5 pt-0">
            <RouterView />
        </div>
    </div>
    <AppSidebar />
</template>


<style lang="scss" scoped>
.container {
    position: relative;
    top: var(--p-navigation-navbar-height);
}

@include break-at(md) {
    .container {
        padding-left: var(--p-navigation-sidebar-width);
    }
}

@include break-at(xl) {
    .container {
        padding-right: calc((100vw - var(--p-content-max-width)) / 2);
        padding-left: calc((100vw - var(--p-content-max-width)) / 2 + var(--p-navigation-sidebar-width));
    }
}
</style>