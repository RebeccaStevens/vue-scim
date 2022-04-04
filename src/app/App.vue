<script setup lang="ts">
import { useQuasar } from "quasar";

// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: "Vitesse",
  meta: [{ name: "description", content: "Opinionated Vite Starter Template" }],
});

const quasar = useQuasar();
quasar.iconMapFn = (iconName) => {
  if (iconName.startsWith("i-") === true) {
    return {
      cls: iconName,
    };
  }
};
</script>

<template>
  <router-view />
</template>
