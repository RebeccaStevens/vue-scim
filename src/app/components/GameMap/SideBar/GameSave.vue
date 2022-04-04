<script setup lang="ts">
import { useGameSaveStore } from "~/app/stores/game-save";

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
  <q-card>
    <q-card-section>Your Save Game</q-card-section>
    <q-card-section justify-evenly>
      <q-btn
        v-show="hasGameSave"
        variant="outlined"
        color="primary"
        @click="onButtonDownload"
        prepend-icon="i-carbon-download"
      >
        Download
      </q-btn>
      <q-btn
        variant="outlined"
        color="primary"
        @click="onButtonLoad"
        prepend-icon="i-carbon-upload"
      >
        Load Save Game
      </q-btn>
      <input
        ref="inputSaveGame"
        class="input-save-game"
        type="file"
        accept=".sav"
        @change="onSaveGameChosen"
      />
    </q-card-section>
  </q-card>
</template>

<style scoped>
.input-save-game {
  display: none;
}
</style>
