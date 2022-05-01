import { acceptHMRUpdate, defineStore } from "pinia";

import type { Tuple } from "~/types";
import { getOrCreateMapElement, getPOIsId } from "~/utils";

export type PurityName = typeof purities[number];

export type ResourceType = "node" | "well";

export type ResourceNodeName = typeof resourceNodes[number];

export type ResourceWellName = typeof resourceWells[number];

export type ResourceName = ResourceNodeName | ResourceWellName;

export type DetailName = typeof details[number];

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

export const enum LayerButtonGroup {
  Details = "details",
  ResourceNodes = "nodes",
  ResourceWells = "wells",
  Collectibles = "collectibles",
}

export const useMapDataStore = defineStore("map-data", {
  state: () => {
    const mapVersion: keyof typeof backgroundLayers =
      Object.keys(backgroundLayers)[0]!;

    const backgroundLayer = backgroundLayers
      .EarlyAccess[0] as typeof backgroundLayers.EarlyAccess[number];

    const detailIds = details.map(
      (name): [string, DetailName, LayerButtonGroup] => [
        getPOIsId(LayerButtonGroup.Details, name),
        name,
        LayerButtonGroup.Details,
      ]
    );
    const resourceNodeIds = resourceNodes.flatMap((resource) =>
      purities.map(
        (purity): [string, ResourceNodeName, PurityName, LayerButtonGroup] => [
          getPOIsId(LayerButtonGroup.ResourceNodes, resource, purity),
          resource,
          purity,
          LayerButtonGroup.ResourceNodes,
        ]
      )
    );
    const resourceWellIds = resourceWells.flatMap((resource) =>
      purities.map(
        (purity): [string, ResourceWellName, PurityName, LayerButtonGroup] => [
          getPOIsId(LayerButtonGroup.ResourceWells, resource, purity),
          resource,
          purity,
          LayerButtonGroup.ResourceWells,
        ]
      )
    );

    const layerButtonData = Object.fromEntries([
      ...detailIds.map(([id, name, group]): [string, LayerButtonData] => [
        id,
        createDetailLayerButtonData(id, group, name),
      ]),
      ...[...resourceNodeIds, ...resourceWellIds].map(
        ([id, resource, purity, group]): [string, LayerButtonData] => [
          id,
          createResourceLayerButtonData(id, group, resource, purity),
        ]
      ),
    ]);

    return {
      mapVersion,
      backgroundLayer,
      layerButtonData,
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

    setLayerVisibility(id: string, value: boolean) {
      const data = this.layerButtonData[id];
      if (data !== undefined) {
        data.show = value;
      }
    },

    toggleLayerVisibility(id: string) {
      const data = this.layerButtonData[id];
      if (data !== undefined) {
        this.setLayerVisibility(id, !data.show);
      }
    },

    registerLayerIcon(id: string, srcset: string) {
      const data = this.layerButtonData[id];
      if (data !== undefined) {
        data.iconSrcset = srcset;
      }
    },

    registerMarkerCount(id: string, count: number) {
      const data = this.layerButtonData[id];
      if (data !== undefined) {
        data.markerCount = count;
      }
    },
  },

  getters: {
    detailLayers: (state) => {
      return Object.fromEntries(
        Object.entries(state.layerButtonData).filter(
          (data): data is [DetailName, DetailLayerButtonData] =>
            data[1].group === LayerButtonGroup.Details
        )
      );
    },

    resourceNodeLayers: (state) => {
      const nodeDataLayers = Object.values(state.layerButtonData).filter(
        (data): data is ResourceLayerButtonData =>
          data.group === LayerButtonGroup.ResourceNodes
      );

      const map = new Map<ResourceNodeName, PurityLayerButtonData>();
      for (const layerData of nodeDataLayers) {
        const element = getOrCreateMapElement(map, layerData.resource, () =>
          Array.from({ length: purities.length })
        );

        element[purities.indexOf(layerData.purity)] = layerData;
      }

      return Object.fromEntries(map.entries());
    },

    resourceWellLayers: (state) => {
      const wellDataLayers = Object.values(state.layerButtonData).filter(
        (data): data is ResourceLayerButtonData =>
          data.group === LayerButtonGroup.ResourceWells
      );

      const map = new Map<ResourceWellName, PurityLayerButtonData>();
      for (const layerData of wellDataLayers) {
        const element = getOrCreateMapElement(map, layerData.resource, () =>
          Array.from({ length: purities.length })
        );

        element[purities.indexOf(layerData.purity)] = layerData;
      }

      return Object.fromEntries(map.entries());
    },
  },
});

if (typeof import.meta.hot === "object") {
  import.meta.hot.accept(acceptHMRUpdate(useMapDataStore, import.meta.hot));
}

export type PurityLayerButtonData = Tuple<
  ResourceLayerButtonData,
  typeof purities["length"]
>;

export type LayerButtonData = {
  id: string;
  group: LayerButtonGroup;
  show: boolean;
  iconSrcset?: string;
  markerCount?: number;
};

export type DetailLayerButtonData = LayerButtonData & {
  name: DetailName;
};
export type ResourceLayerButtonData = LayerButtonData & {
  resource: ResourceName;
  purity: PurityName;
};

function createDetailLayerButtonData(
  id: string,
  group: LayerButtonGroup,
  name: DetailName
): DetailLayerButtonData {
  return {
    id,
    group,
    name,
    show: false,
  };
}

function createResourceLayerButtonData(
  id: string,
  group: LayerButtonGroup,
  resource: ResourceName,
  purity: PurityName
): ResourceLayerButtonData {
  return {
    id,
    group,
    resource,
    purity,
    show: false,
  };
}

export function isResourceNodeName(name: string): name is ResourceNodeName {
  return resourceNodes.includes(name);
}

export function isResourceWellName(name: string): name is ResourceWellName {
  return resourceWells.includes(name);
}

export function isPurityName(purity: string): purity is PurityName {
  return purities.includes(purity);
}
