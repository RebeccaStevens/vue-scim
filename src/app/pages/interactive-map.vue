<template>
  <div class="host">
    <GameMap class="game-map" />
    <GameMap_SideBar class="side-bar" />
  </div>
</template>

<style scoped>
.host {
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

.side-bar {
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
