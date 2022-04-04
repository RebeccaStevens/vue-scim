<script setup lang="ts">
const router = useRouter();
const { t } = useI18n();
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <NavBar />
    </q-header>

    <q-page-container text-center>
      <div mt-12 text-4xl>
        <div i-carbon-warning inline-block />
      </div>
      <router-view />
      <div>
        <q-btn m="3 t8" @click="router.back()">{{ t("navigation.back.label") }}</q-btn>
      </div>
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <Footer />
    </q-footer>
  </q-layout>
</template>

<style scoped>
.v-footer {
  flex-grow: 0;
}
</style>
