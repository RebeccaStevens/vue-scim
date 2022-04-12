<template>
  <div class="page-map">
    <GameMap class="game-map" />
    <Controls class="controls" />
  </div>
</template>

<style scoped>
.page-map {
  display: flex;
  height: 100%;
  column-gap: 1.5rem;
  row-gap: 1.5rem;
  margin: 1.5rem;
}

.game-map {
  margin: 0;
  flex-grow: 1;
  flex-basis: 75%;
}

.controls {
  margin: 0;
  flex-grow: 1;
  flex-basis: 25%;
  min-width: 25rem;
  max-width: 30rem;
}
</style>

<route lang="yaml">
meta:
  layout: default
</route>
