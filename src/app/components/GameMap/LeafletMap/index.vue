<script setup lang="ts">
import { createMap } from "./map";

const mapVersion = "EarlyAccess" as const;

function setupMap() {
  const mapData = createMap("leaflet-game-map-container", mapVersion);
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
