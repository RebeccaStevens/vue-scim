import { acceptHMRUpdate, defineStore } from "pinia";

import type { MapLayerName } from "~/components/GameMap/LeafletMap/map";

const purities = ["impure", "normal", "pure"] as const;

const resourceNodes = [
  "ironOre",
  "copperOre",
  "limestone",
  "coal",
  "cateriumOre",
  "rawQuartz",
  "sulfur",
  "uranium",
  "bauxite",
  "crudeOil",
  "samOre",
] as const;

const resourceWells = ["nitrogenGas", "crudeOil", "water", "geyser"] as const;

const details = [
  "spawn",
  "worldBorder",
  "sporeFlowers",
  "pillars",
  "smallRocks",
  "largeRocks",
  "caves",
  "roads",
] as const;

export const useMapDataStore = defineStore("map-data", {
  state: () => {
    const backgroundLayer = "gameLayer" as MapLayerName;

    const detailLayers = Object.fromEntries(
      details.map((name) => [name, createButtonData()])
    ) as Record<typeof details[number], ButtonData>;

    const resourceNodeLayers = Object.fromEntries(
      resourceNodes.map((name) => [name, createResourceData()])
    ) as Record<typeof resourceNodes[number], ResourceData>;

    const resourceWellLayers = Object.fromEntries(
      resourceWells.map((name) => [name, createResourceData()])
    ) as Record<typeof resourceWells[number], ResourceData>;

    return {
      backgroundLayer,
      detailLayers,
      resourceNodeLayers,
      resourceWellLayers,
    };
  },

  actions: {
    switchToGameLayer() {
      this.backgroundLayer = "gameLayer";
    },

    switchToRealisticLayer() {
      this.backgroundLayer = "realisticLayer";
    },

    toggleDetailLayer(type: typeof details[number]) {
      this.detailLayers[type].show = !this.detailLayers[type].show;
    },

    toggleResourceNodeLayer(
      resource: typeof resourceNodes[number],
      purity: keyof ResourceData
    ) {
      this.resourceNodeLayers[resource][purity].show =
        !this.resourceNodeLayers[resource][purity].show;
    },

    toggleResourceWellLayer(
      resource: typeof resourceWells[number],
      purity: keyof ResourceData
    ) {
      this.resourceWellLayers[resource][purity].show =
        !this.resourceWellLayers[resource][purity].show;
    },

    registerResourceNodeLayerIcon(
      resource: string,
      purity: string,
      srcSet: string
    ) {
      console.assert(
        isResourceNodesName(resource),
        `"${resource}" is not a valid resource node name.`
      );
      console.assert(
        isPurityName(purity),
        `"${purity}" is not a valid purity name.`
      );
      this.resourceNodeLayers[resource][purity].iconSrcSet = srcSet;
    },

    registerResourceWellLayerIcon(
      resource: string,
      purity: string,
      srcSet: string
    ) {
      console.assert(
        isResourceWellsName(resource),
        `"${resource}" is not a valid resource well name.`
      );
      console.assert(
        isPurityName(purity),
        `"${purity}" is not a valid purity name.`
      );
      this.resourceWellLayers[resource][purity].iconSrcSet = srcSet;
    },
  },
});

if (typeof import.meta.hot === "object") {
  import.meta.hot.accept(acceptHMRUpdate(useMapDataStore, import.meta.hot));
}

export type ResourceData = Record<typeof purities[number], ButtonData>;

function createResourceData(): ResourceData {
  return {
    impure: {
      show: false,
    },
    normal: {
      show: false,
    },
    pure: {
      show: false,
    },
  };
}

export type ButtonData = {
  show: boolean;
  iconSrcSet?: string;
};

function createButtonData(): ButtonData {
  return {
    show: false,
  };
}

function isResourceNodesName(
  name: string
): name is typeof resourceNodes[number] {
  return resourceNodes.includes(name);
}

function isResourceWellsName(
  name: string
): name is typeof resourceWells[number] {
  return resourceWells.includes(name);
}

function isPurityName(purity: string): purity is typeof purities[number] {
  return purities.includes(purity);
}
