import { acceptHMRUpdate, defineStore } from "pinia";

import * as assert from "~/assert";

export type PurityName = typeof purities[number];

export type ResourceType = "node" | "well";

export type ResourceNodeName = typeof resourceNodes[number];

export type ResourceWellName = typeof resourceWells[number];

export type ResourceName = ResourceNodeName | ResourceWellName;

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
      resourceNodes.map((name) => [name, createResourceLayerData()])
    ) as Record<ResourceNodeName, ResourceLayerData>;

    const resourceWellLayers = Object.fromEntries(
      resourceWells.map((name) => [name, createResourceLayerData()])
    ) as Record<ResourceWellName, ResourceLayerData>;

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

    setDetailLayer(type: typeof details[number], value: boolean) {
      this.detailLayers[type].show = value;
    },

    setResourceLayer(
      type: ResourceType,
      resource: ResourceName,
      purity: keyof ResourceLayerData,
      value: boolean
    ) {
      if (type === "node") {
        assert.ok(
          isResourceNodeName(resource),
          `"${resource}" is not a valid resource node name.`
        );
        this.setResourceNodeLayer(resource, purity, value);
      } else {
        assert.ok(
          isResourceWellName(resource),
          `"${resource}" is not a valid resource well name.`
        );
        this.setResourceWellLayer(resource, purity, value);
      }
    },

    setResourceNodeLayer(
      resource: ResourceNodeName,
      purity: keyof ResourceLayerData,
      value: boolean
    ) {
      this.resourceNodeLayers[resource][purity].show = value;
    },

    setResourceWellLayer(
      resource: ResourceWellName,
      purity: keyof ResourceLayerData,
      value: boolean
    ) {
      this.resourceWellLayers[resource][purity].show = value;
    },

    toggleDetailLayer(type: typeof details[number]) {
      this.setDetailLayer(type, !this.detailLayers[type].show);
    },

    toggleResourceLayer(
      type: ResourceType,
      resource: ResourceName,
      purity: keyof ResourceLayerData
    ) {
      if (type === "node") {
        assert.ok(
          isResourceNodeName(resource),
          `"${resource}" is not a valid resource node name.`
        );
        this.toggleResourceNodeLayer(resource, purity);
      } else {
        assert.ok(
          isResourceWellName(resource),
          `"${resource}" is not a valid resource well name.`
        );
        this.toggleResourceWellLayer(resource, purity);
      }
    },

    toggleResourceNodeLayer(
      resource: ResourceNodeName,
      purity: keyof ResourceLayerData
    ) {
      this.setResourceNodeLayer(
        resource,
        purity,
        !this.resourceNodeLayers[resource][purity].show
      );
    },

    toggleResourceWellLayer(
      resource: ResourceWellName,
      purity: keyof ResourceLayerData
    ) {
      this.setResourceWellLayer(
        resource,
        purity,
        !this.resourceWellLayers[resource][purity].show
      );
    },

    registerResourceNodeLayerIcon(
      resource: string,
      purity: string,
      srcset: string
    ) {
      assert.ok(
        isResourceNodeName(resource),
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
        isResourceWellName(resource),
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

export type ResourceLayerData = Record<PurityName, ButtonData>;

function createResourceLayerData(): ResourceLayerData {
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

function isResourceNodeName(name: string): name is ResourceNodeName {
  return resourceNodes.includes(name);
}

function isResourceWellName(name: string): name is ResourceWellName {
  return resourceWells.includes(name);
}

function isPurityName(purity: string): purity is PurityName {
  return purities.includes(purity);
}
