<script setup lang="ts">
import { useGameSaveStore } from "~/stores/game-save";

const { t } = useI18n();
const { hasGameSave } = useGameSaveStore();

const inputSaveGame = ref<HTMLInputElement | null>(null);

const onButtonDownload = () => {};

const onButtonLoad = () => {
  console.assert(inputSaveGame.value !== null, "Cannot find input: save game.");
  inputSaveGame.value.click();
};

const onSaveGameChosen = () => {
  console.assert(inputSaveGame.value !== null, "Cannot find input: save game.");

  const file = inputSaveGame.value.files?.[0];
  console.assert(file !== undefined, "Cannot find chosen file.");

  inputSaveGame.value.value = "";

  // TODO: load file
};
</script>

<template>
  <q-card-section flex justify-around :class="{ actions: true, 'has-game-save': hasGameSave }">
    <q-btn
      flat
      stack
      size="sm"
      v-show="hasGameSave"
      icon="i-carbon-analytics"
      :label="t('Statistics')"
    ></q-btn>
    <q-btn
      flat
      stack
      size="sm"
      v-show="hasGameSave"
      icon="i-clarity-flask-solid"
      :label="t('Research')"
    ></q-btn>
    <q-btn
      flat
      stack
      size="sm"
      v-show="hasGameSave"
      icon="i-fa6-solid-gears"
      :label="t('Options')"
    ></q-btn>
    <q-btn
      flat
      stack
      size="sm"
      v-show="hasGameSave"
      @click="onButtonDownload"
      icon="i-carbon-download"
      :label="t('Download')"
    ></q-btn>
    <q-btn
      :flat="hasGameSave"
      :stack="hasGameSave"
      :size="hasGameSave ? 'sm' : '1.125rem'"
      class="load-btn"
      @click="onButtonLoad"
      icon="i-carbon-upload"
      :label="hasGameSave ? t('Load') : t('Load Save Game')"
    ></q-btn>
    <input
      ref="inputSaveGame"
      class="input-save-game"
      type="file"
      accept=".sav"
      @change="onSaveGameChosen"
    />
  </q-card-section>
</template>

<style scoped>
.actions {
  padding: 0.75rem;
}
.actions:not(.has-game-save) {
  padding: 0;
}
.actions:not(.has-game-save):deep(.load-btn) {
  aspect-ratio: 6/1;
  width: 100%;
}
.input-save-game {
  display: none;
}
</style>
