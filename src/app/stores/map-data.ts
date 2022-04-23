import { acceptHMRUpdate, defineStore } from "pinia";

import type { MapLayerName } from "~/components/GameMap/LeafletMap/map";

export const useMapDataStore = defineStore("map-data", {
  state: () => {
    const backgroundLayer = "gameLayer" as MapLayerName;
    const detailLayers = {
      spawn: false,
      worldBorder: false,
      sporeFlowers: false,
      pillars: false,
      smallRocks: false,
      largeRocks: false,
      caves: false,
      roads: false,
    };

    return {
      backgroundLayer,
      detailLayers,
    };
  },

  actions: {
    switchToGameLayer() {
      this.backgroundLayer = "gameLayer";
    },

    switchToRealisticLayer() {
      this.backgroundLayer = "realisticLayer";
    },

    toggleDetailLayer(layerId: keyof typeof this.detailLayers) {
      this.detailLayers[layerId] = !this.detailLayers[layerId];
    },
  },
});

if (typeof import.meta.hot === "object") {
  import.meta.hot.accept(acceptHMRUpdate(useMapDataStore, import.meta.hot));
}
