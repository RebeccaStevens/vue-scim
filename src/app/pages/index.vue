<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <q-page-container>
    <q-page>
      <p>{{ t("pages.home.label") }}</p>
    </q-page>
  </q-page-container>
</template>

<route lang="yaml">
meta:
  layout: default
</route>
