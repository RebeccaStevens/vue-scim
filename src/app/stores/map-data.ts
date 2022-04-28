import { acceptHMRUpdate, defineStore } from "pinia";

import * as assert from "~/assert";

export const backgroundLayers = {
  EarlyAccess: ["gameLayer", "realisticLayer"],
} as const;

export const purities = ["impure", "normal", "pure"] as const;

export const resourceNodes = [
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

export const resourceWells = [
  "nitrogenGas",
  "crudeOil",
  "water",
  "geyser",
] as const;

export const details = [
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
    const mapVersion = Object.keys(
      backgroundLayers
    )[0] as keyof typeof backgroundLayers;

    const backgroundLayer = backgroundLayers
      .EarlyAccess[0] as typeof backgroundLayers.EarlyAccess[number];

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
      mapVersion,
      backgroundLayer,
      detailLayers,
      resourceNodeLayers,
      resourceWellLayers,
    };
  },

  actions: {
    setMapVersion<V extends keyof typeof backgroundLayers>(
      version: V,
      layer: typeof backgroundLayers[V][number]
    ) {
      this.mapVersion = version;
      this.backgroundLayer = layer;
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
      srcset: string
    ) {
      assert.ok(
        isResourceNodesName(resource),
        `"${resource}" is not a valid resource node name.`
      );
      assert.ok(
        isPurityName(purity),
        `"${purity}" is not a valid purity name.`
      );
      this.resourceNodeLayers[resource][purity].iconSrcset = srcset;
    },

    registerResourceWellLayerIcon(
      resource: string,
      purity: string,
      srcset: string
    ) {
      assert.ok(
        isResourceWellsName(resource),
        `"${resource}" is not a valid resource well name.`
      );
      assert.ok(
        isPurityName(purity),
        `"${purity}" is not a valid purity name.`
      );
      this.resourceWellLayers[resource][purity].iconSrcset = srcset;
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
  iconSrcset?: string;
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
