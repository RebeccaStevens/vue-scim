<script setup lang="ts">
export type Props = {
  value?: boolean;
  title?: string;
  count?: number;
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
    :class="{ 'toggle-button': true, 'q-btn--active': value }"
    @click="onClick"
    @mousedown="onMouseDown"
  >
    <q-badge v-if="count !== undefined">{{ count }}</q-badge>
    <slot></slot>
  </q-btn>
</template>

<style scoped lang="scss">
.q-btn {
  margin: 0.2rem 0.2rem max(0.2rem, 5px) 0.2rem;

  &:not(:disabled) {
    &.q-btn--active {
      box-shadow: 0 0 0 0.2rem rgb(243 156 18 / 50%);
    }
    &:not(:disabled):hover .q-badge {
      font-size: 0.9em;
    }
  }

  &:disabled {
    filter: grayscale(0.5);
    opacity: 0.5 !important;

    &:active,
    &.q-btn--active {
      transform: none;
    }
  }
}

.q-badge {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
  border-top-left-radius: 0;
  border-top-right-radius: 0.4rem;
  border-bottom-left-radius: 0.4rem;
  border-bottom-right-radius: 0;
  min-width: calc(var(--badge-width) + 0.25em);
  line-height: 1;
  justify-content: center;
  font-size: 0.8em;

  transition: font-size 0.2s;
  will-change: font-size;
}
</style>
