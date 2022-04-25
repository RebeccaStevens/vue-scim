<script setup lang="ts">
import { useMapDataStore } from "~/stores/map-data";

import type { MapInstance } from "./map";
import { createMap, setMapBackgroundLayer } from "./map";

const mapVersion = "EarlyAccess" as const;

const mapDataStore = useMapDataStore();

const mapInstance = ref<MapInstance>();

watch(toRef(mapDataStore, "backgroundLayer"), (layerName) => {
  if (mapInstance.value !== undefined) {
    setMapBackgroundLayer(mapInstance.value, layerName);
  }
});

async function setupMap() {
  mapInstance.value = await createMap("leaflet-game-map-container", mapVersion);
}

function cleanup() {
  if (mapInstance.value !== undefined) {
    mapInstance.value.cleanup();
  }
}

onMounted(setupMap);
onUnmounted(cleanup);
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
