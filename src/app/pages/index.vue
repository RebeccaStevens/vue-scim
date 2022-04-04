<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <p>{{ t("navigation.pages.home.label") }}</p>
</template>

<route lang="yaml">
meta:
  layout: default
</route>
