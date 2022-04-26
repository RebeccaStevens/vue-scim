<script setup lang="ts">
// import { useGameSaveStore } from "~/stores/game-save";

// const { hasGameSave } = useGameSaveStore();
</script>

<template>
  <div class="controls">
    <q-card class="bg-primary" dark>
      <ActionButtons />
    </q-card>

    <q-card>
      <StaticElementButtons />
    </q-card>

    <!-- <q-card v-show="hasGameSave">
      <Filters />
    </q-card> -->
  </div>
</template>

<style scoped>
.controls {
  display: flex;
  flex-direction: column;
}
.controls .q-card:not(:last-child) {
  margin-bottom: 1.5rem;
}
</style>
