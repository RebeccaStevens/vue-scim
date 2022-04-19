<script setup lang="ts">
import { createMap } from "./map";

const mapVersion = "EarlyAccess" as const;

async function setupMap() {
  const mapData = await createMap("leaflet-game-map-container", mapVersion);
}

onMounted(setupMap);
</script>

<template>
  <div id="leaflet-game-map-container"></div>
</template>

<style scoped>
#leaflet-game-map-container {
  width: 100%;
  height: 100%;
}
</style>

<style>
/**
 * Workaround for 1px lines appearing in some browsers due to fractional transforms and resulting anti-aliasing.
 * @see https://github.com/Leaflet/Leaflet/issues/3575
 */
@supports (-webkit-appearance: none) and (not (-moz-appearance: none)) {
  .leaflet-pan-animated .leaflet-tile[style*="width: 256px"],
  .leaflet-zoom-animated .leaflet-tile[style*="width: 256px"] {
    width: 256.5px !important;
    height: 256.5px !important;
    mix-blend-mode: darken;
  }
}
</style>
