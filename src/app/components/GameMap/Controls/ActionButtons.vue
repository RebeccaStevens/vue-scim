<script setup lang="ts">
import * as assert from "~/assert";
import { useGameSaveStore } from "~/stores/game-save";

const { t } = useI18n();
const { hasGameSave } = useGameSaveStore();

const inputSaveGame = ref<HTMLInputElement | null>(null);

const onButtonDownload = () => {};

const onButtonLoad = () => {
  assert.isDefined(inputSaveGame.value, "Cannot find input: save game.");
  inputSaveGame.value.click();
};

const onSaveGameChosen = () => {
  assert.isDefined(inputSaveGame.value, "Cannot find input: save game.");

  const file = inputSaveGame.value.files?.[0];
  assert.isDefined(file, "Cannot find chosen file.");

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
      :label="t('navigation.pages.interactive-map.actions.statistics.label')"
    ></q-btn>
    <q-btn
      flat
      stack
      size="sm"
      v-show="hasGameSave"
      icon="i-clarity-flask-solid"
      :label="t('navigation.pages.interactive-map.actions.research.label')"
    ></q-btn>
    <q-btn
      flat
      stack
      size="sm"
      v-show="hasGameSave"
      icon="i-fa6-solid-gears"
      :label="t('navigation.pages.interactive-map.actions.options.label')"
    ></q-btn>
    <q-btn
      flat
      stack
      size="sm"
      v-show="hasGameSave"
      @click="onButtonDownload"
      icon="i-carbon-download"
      :label="t('navigation.pages.interactive-map.actions.download.label')"
    ></q-btn>
    <q-btn
      :flat="hasGameSave"
      :stack="hasGameSave"
      :size="hasGameSave ? 'sm' : '1.125rem'"
      class="load-btn"
      @click="onButtonLoad"
      icon="i-carbon-upload"
      :label="
        hasGameSave
          ? t('navigation.pages.interactive-map.actions.load.short-label')
          : t('navigation.pages.interactive-map.actions.load.label')
      "
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
