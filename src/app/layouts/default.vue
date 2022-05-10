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
