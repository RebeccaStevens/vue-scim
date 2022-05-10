<script setup lang="ts"></script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <NavBar />
    </q-header>

    <router-view />

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
