<script setup lang="ts">
import type { QImgProps } from "quasar";

import type { Props as ToggleButtonProps } from "./ToggleButton.vue";

export type Props = {
  src?: QImgProps["src"];
  srcset?: QImgProps["srcset"];
  value?: ToggleButtonProps["value"];
  dense?: ToggleButtonProps["dense"];
  label?: ToggleButtonProps["label"];
  noCaps?: ToggleButtonProps["noCaps"];
  title?: ToggleButtonProps["title"];
  ratio?: QImgProps["ratio"];
  fit?: QImgProps["fit"];
};

export type Emits = {
  (event: "change", value: boolean): void;
};

const props = withDefaults(defineProps<Props>(), {
  value: false,
  fit: "contain",
});

const emit = defineEmits<Emits>();

const onChange = () => {
  console.assert(typeof props.value === "boolean");
  emit("change", !props.value);
};
</script>

<template>
  <ToggleButton
    :value="value"
    :dense="dense"
    :label="label"
    :noCaps="noCaps"
    :title="title"
    class="image-toggle-button"
    @change="onChange"
  >
    <q-img :src="src" :srcset="srcset" :ratio="ratio" :fit="fit" />
  </ToggleButton>
</template>

<style scoped lang="scss">
.image-toggle-button {
  border-radius: 0.5rem;
  padding: 0.25rem;
  margin: 0.25rem;

  :deep(.q-btn__content) {
    margin: -0.25rem;
  }

  :deep(.q-img__image) {
    border-radius: 0.5rem;
  }
}
</style>
