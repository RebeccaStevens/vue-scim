<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div text-center text-gray-800 dark:text-gray-100>
    {{ t("not-found") }}
  </div>
</template>

<route lang="yaml">
meta:
  layout: 404
</route>
