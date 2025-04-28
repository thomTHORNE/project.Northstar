<script setup lang="ts">
import { doRx } from '@/common/composables/reactivity/doRx';
import { LayoutName } from '@/features/layouts/layoutName';
import Toast from 'primevue/toast';
import { useRoute } from 'vue-router';
import { ROUTE_META } from './common/constants/routeMeta';

const route = useRoute();

const layout = doRx(LayoutName.Blank)
  .subscribe(() => route.meta, ({ incoming }, { ref }) => {
    document.body.classList[route.path.includes(ROUTE_META.login.path) ? 'remove' : 'add']('panel-background')
    ref.value = incoming.layout as LayoutName ?? LayoutName.Default
  });
</script>

<template>
  <component :is="layout">
    <!-- <routerView /> -->
  </component>
  <Toast />
  <!--  <div id="app-dialog"></div>-->
</template>

<style>
html {
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  color: var(--text-color);
}

body {
  background-color: var(--p-content-background);
}

.panel-background {
  background-blend-mode: multiply;
  background-image: url(/pattern.png);
  background-position: 130px top;
  background-repeat: no-repeat;
  background-size: clamp(1000px, 100%, 2000px);
}

@media only screen and (min-width: 2000px) {
  .panel-background {
    background-repeat: repeat-x;
    background-size: 2000px;
  }
}

h1,
h2,
h3,
label {
  color: var(--p-text-color)
}
</style>
<style src="primeflex/primeflex.scss" />
<style src="primeicons/primeicons.css" />