<script setup lang="ts">
type Props = {
  src?: string;
  srcSet?: string;
  value?: boolean;
  dense?: boolean;
  label?: string;
  noCaps?: boolean;
  title?: string;
  ratio?: number;
  fit?: string;
};

type Emits = {
  (event: "change", value: boolean): void;
};

const props = withDefaults(defineProps<Props>(), {
  value: false,
  fit: "contain",
});

const emit = defineEmits<Emits>();

const onChange = () => {
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
    <q-img :src="src" :srcset="srcSet" :ratio="ratio" :fit="fit" />
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
