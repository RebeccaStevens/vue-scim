<script setup lang="ts">
import type { QBtnProps } from "quasar";

export type Props = {
  value?: boolean;
  dense?: QBtnProps["dense"];
  label?: QBtnProps["label"];
  noCaps?: QBtnProps["noCaps"];
  title?: string;
};

export type Emits = {
  (event: "change", value: boolean): void;
};

const props = withDefaults(defineProps<Props>(), {
  value: false,
});

const emit = defineEmits<Emits>();

const onClick = () => {
  emit("change", !props.value);
};

const onMouseDown = (event: MouseEvent) => {
  event.preventDefault();
};
</script>

<template>
  <q-btn
    push
    :title="title"
    :label="label"
    :dense="dense"
    :no-caps="noCaps"
    :class="{ 'toggle-button': true, 'q-btn--active': value }"
    @click="onClick"
    @mousedown="onMouseDown"
  >
    <slot></slot>
  </q-btn>
</template>

<style scoped lang="scss">
.q-btn {
  margin: 0.2rem 0.2rem max(0.2rem, 5px) 0.2rem;

  &.q-btn--active {
    box-shadow: 0 0 0 0.2rem rgb(243 156 18 / 50%);
  }
}
</style>
