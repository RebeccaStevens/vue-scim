<script setup lang="ts">
const checked = ref(false);

defineProps<{
  src: string;
  title?: string;
}>();
</script>

<template>
  <q-item tag="label" dense :class="{ node: true, checked }" :title="title">
    <q-checkbox display-none v-model="checked" />
    <q-img :src="src" loading="lazy" ratio="1" fit="contain" />
    <slot></slot>
  </q-item>
</template>

<style scoped>
.node {
  /* border: 0.05rem solid #444; */
  border-radius: 0.5rem;
  padding: 0.25rem;
  margin: 0.25rem;
  width: 3.5rem;
  aspect-ratio: 1;
}
.node.checked {
  /* border-color: transparent; */
  box-shadow: 0 0 0 0.2rem rgb(243 156 18 / 50%);
}
</style>
