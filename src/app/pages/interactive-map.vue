<template>
  <div class="page-map">
    <GameMap class="game-map" />
    <Controls class="controls" />
  </div>
</template>

<style scoped lang="scss">
$spacing: 1.5rem;

$controlsWidth: 25%;
$controlsMinWidth: 25rem;
$controlsMaxWidth: 30rem;

$toolbarHeight: 50px;

.page-map {
  min-height: 100%;
  margin: $spacing;
  position: relative;
}

.game-map {
  margin: 0;
  position: fixed;
  top: calc($toolbarHeight + $spacing);
  bottom: calc($toolbarHeight + $spacing);
  left: $spacing;
  right: calc(clamp($controlsMinWidth, $controlsWidth, $controlsMaxWidth) + 2 * $spacing);
}

.controls {
  margin: 0 0 0 auto;
  width: $controlsWidth;
  min-width: $controlsMinWidth;
  max-width: $controlsMaxWidth;
}
</style>

<route lang="yaml">
meta:
  layout: default
</route>
