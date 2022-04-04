<script setup lang="ts">
const props = defineProps<{
  m_initial: number;
}>();

const { count, inc, dec } = useCounter(props.m_initial);
</script>

<template>
  <div>
    {{ count }}
    <button class="inc" @click="inc()">+</button>
    <button class="dec" @click="dec()">-</button>
  </div>
</template>
