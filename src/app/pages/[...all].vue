<script setup lang="ts">
const router = useRouter();
const { t } = useI18n();
</script>

<template>
  <q-page-container>
    <q-page text-center text-gray-800 dark:text-gray-100>
      <div mt-12 text-4xl>
        <div i-carbon-warning inline-block />
      </div>

      <div class="capitalize">
        {{ t("navigation.not-found.label") }}
      </div>

      <div>
        <q-btn m="3 t8" @click="router.back()">{{ t("navigation.back.label") }}</q-btn>
      </div>
    </q-page>
  </q-page-container>
</template>

<route lang="yaml">
meta:
  layout: 404
</route>
