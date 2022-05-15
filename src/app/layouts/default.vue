<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary">
      <NavBar />
    </q-header>

    <router-view />

    <q-footer elevated>
      <Footer />
    </q-footer>
  </q-layout>
</template>
