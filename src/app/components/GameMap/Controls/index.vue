<script setup lang="ts">
import { useGameSaveStore } from "~/stores/game-save";

import Actions from "./Actions.vue";
import Filters from "./Filters.vue";
import StaticElements from "./StaticElements.vue";

const { t } = useI18n();
const { hasGameSave } = useGameSaveStore();
</script>

<template>
  <div class="controls">
    <q-card class="bg-primary" dark>
      <Actions />
    </q-card>

    <q-card>
      <StaticElements />
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
