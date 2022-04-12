<!-- From: https://github.com/quasarframework/quasar/issues/5787#issuecomment-1014585492 -->

<template>
  <slot :activatorAttr="activatorAttr" :menuAttr="menuAttr" />
</template>

<script setup lang="ts">
import { debounce } from "quasar";
import { ref, watch } from "vue";

const props = defineProps({
  debounceTime: {
    type: Number,
    default: 50,
  },
});

const activatorHover = ref(false);
const menuHover = ref(false);
const menu = ref(false);

const checkMenu = () => {
  menu.value = activatorHover.value || menuHover.value;
};

const debounceMenu = debounce(checkMenu, props.debounceTime);

watch(menuHover, () => {
  debounceMenu();
});
watch(activatorHover, () => {
  debounceMenu();
});

const activatorAttr = {
  onMouseenter: () => (activatorHover.value = true),
  onMouseleave: () => (activatorHover.value = false),
};
const menuAttr = ref({
  modelValue: menu,
  onMouseenter: () => (menuHover.value = true),
  onMouseleave: () => (menuHover.value = false),
});
</script>
