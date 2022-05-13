<script setup lang="ts">
import type { backgroundLayers } from "~/stores/map-data";
import { useMapDataStore } from "~/stores/map-data";

import type { MapInstance } from "./map";
import { createMap, onMapBackgroundLayerChange } from "./map";

const mapDataStore = useMapDataStore();

const mapInstance = ref<MapInstance<keyof typeof backgroundLayers>>();

watch(toRef(mapDataStore, "backgroundLayer"), (newLayer, oldLayer) => {
  if (mapInstance.value !== undefined) {
    onMapBackgroundLayerChange(mapInstance.value, newLayer, oldLayer);
  }
});

async function setupMap() {
  mapInstance.value = await createMap("leaflet-game-map-container", mapDataStore.mapVersion);
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
  <div class="relative-position fit">
    <div id="leaflet-game-map-container" class="fit"></div>
    <resize-observer @notify="mapInstance?.map.invalidateSize()" />
  </div>
</template>

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
