/* eslint-disable unicorn/no-array-method-this-argument */

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { WatchStopHandle } from "vue";

import type { ResourceData } from "~/stores/map-data";
import { backgroundLayers, useMapDataStore } from "~/stores/map-data";
import { transpose, getResourcePurityId } from "~/utils";

import type { LayersDataMap, POIs } from "./details";
import { loadDetails } from "./details";
import { getBounds, tileSize } from "./utils";

export type MapInstance<V extends keyof typeof backgroundLayers> = Readonly<{
  map: L.Map;
  layers: Map<typeof backgroundLayers[V][number], L.TileLayer>;
  bounds: L.LatLngBoundsExpression;
  layerPOIs: POIs[];
  cleanup: () => void;
}>;

const mapDataStore = useMapDataStore();

const zoomOptions = {
  min: 0.5,
  max: 10,
  minNative: 1,
  maxNative: 6,
  delta: 0.25,
  snap: 0.25,
};

/**
 * Create the actual leaflet map.
 *
 * @param containerId - The id of the html container element the map should be mounted into.
 */
export async function createMap<V extends keyof typeof backgroundLayers>(
  containerId: string,
  versionName: V
): Promise<MapInstance<V>> {
  const map = L.map(containerId, {
    crs: L.CRS.Simple,
    minZoom: zoomOptions.min,
    maxZoom: zoomOptions.max,
    zoom: zoomOptions.min,
    zoomDelta: zoomOptions.delta,
    zoomSnap: zoomOptions.snap,
    // preferCanvas: true,
    attributionControl: false,
    // boxZoom: false,
    // doubleClickZoom: false,
    // keyboard: false,
    // scrollWheelZoom: false,
    // zoomControl: false,
  });

  return setMapVersion(map, versionName);
}

/**
 * Set the active/visible map version.
 *
 * @param map - The map.
 * @param version - The name of the map version.
 */
export async function setMapVersion<V extends keyof typeof backgroundLayers>(
  map: L.Map,
  version: V
): Promise<MapInstance<V>> {
  const { cleanup: cleanupMapVersion, ...mapVersionData } = setupMapVersion(
    map,
    version
  );

  const layerName = mapDataStore.backgroundLayer;
  const layer = mapVersionData.layers.get(layerName);
  console.assert(
    layer !== undefined,
    `Could not find the layer with name "${layerName}"`
  );

  map.addLayer(layer);

  const detailLayers = await loadDetails(map, version);

  const { cleanup: cleanupDetailLayer, layerPOIs } = setupDetailLayerToggles(
    detailLayers,
    map
  );

  const cleanup = () => {
    cleanupMapVersion();
    cleanupDetailLayer();
  };

  return {
    ...mapVersionData,
    map,
    layerPOIs,
    cleanup,
  };
}

/**
 * Make the background layer of the leaflet map change.
 *
 * To be called when a relevant user event is detected.
 *
 * @param mapInstance - The map data.
 * @param newLayerName - The name of the layer to make visible.
 * @param oldLayerName - The name of the layer currently visible.
 */
export function onMapBackgroundLayerChange<
  V extends keyof typeof backgroundLayers
>(
  mapInstance: MapInstance<V>,
  newLayerName: typeof backgroundLayers[V][number],
  oldLayerName?: typeof backgroundLayers[V][number]
) {
  console.assert(
    newLayerName !== oldLayerName,
    `Background layer "${newLayerName}" already set.`
  );

  // TODO: Delay removal.
  // https://github.com/Leaflet/Leaflet/issues/8192
  const oldLayer = mapInstance.layers.get(oldLayerName);
  if (oldLayer !== undefined) {
    mapInstance.map.removeLayer(oldLayer);
  }

  const newLayer = mapInstance.layers.get(newLayerName);
  console.assert(
    newLayer !== undefined,
    `Could not find the layer with name "${newLayerName}"`
  );

  mapDataStore.backgroundLayer = newLayerName;
  mapInstance.map.addLayer(newLayer);
}

/**
 * Setup the map for the given version.
 *
 * @param map - The map.
 * @param version - The name of the map version.
 */
function setupMapVersion<V extends keyof typeof backgroundLayers>(
  map: L.Map,
  version: V
) {
  const bounds = getBounds(map);
  const maxBounds = bounds.pad(0.1);

  map.setMaxBounds(maxBounds);
  map.fitBounds(bounds);

  const layers = setupMapLayers(version, bounds);

  const setMinZoom = () => {
    const oldMinZoom = map.getMinZoom();
    const oldZoom = map.getZoom();

    map.setMinZoom(0);
    const newMinZoom = Math.max(map.getBoundsZoom(maxBounds, false), 0.5);
    const newZoom = map.getScaleZoom(newMinZoom / oldMinZoom, oldZoom);

    map.setMinZoom(newMinZoom);
    map.setZoom(newZoom);
  };

  setMinZoom();
  map.addEventListener("resize", setMinZoom);
  const cleanup = () => {
    map.removeEventListener("resize", setMinZoom);
  };

  return {
    bounds,
    layers,
    cleanup,
  };
}

/**
 * Setup the layers of the leaflet map.
 *
 * @param version - The version of the map to create the layers for.
 * @param bounds - The bounds of the leaflet map.
 * @returns The layers of the map.
 */
function setupMapLayers<V extends keyof typeof backgroundLayers>(
  version: V,
  bounds: L.LatLngBoundsExpression
) {
  const options: L.TileLayerOptions = {
    noWrap: true,
    bounds,
    tileSize,
    minZoom: zoomOptions.min,
    maxZoom: zoomOptions.max,
    minNativeZoom: zoomOptions.minNative,
    maxNativeZoom: zoomOptions.maxNative,
    // detectRetina: true,
  };

  return new Map(
    backgroundLayers[version].map((layer) => [
      layer,
      L.tileLayer(`/img/map/${version}/${layer}/{z}/{x}/{y}.webp`, options),
    ])
  );
}

function setupDetailLayerToggles(layersDataMap: LayersDataMap, map: L.Map) {
  const layerRefs = [
    ...Object.entries(mapDataStore.detailLayers).map(
      ([name, value]) =>
        [name, toRef(mapDataStore.detailLayers[name], "show"), value] as const
    ),
    ...mapResourcesToRefs(mapDataStore.resourceNodeLayers, "nodes"),
    ...mapResourcesToRefs(mapDataStore.resourceWellLayers, "wells"),
  ];

  const [cleanupDetailLayers, layerPOIs] = transpose(
    layerRefs.map(([name, ref, currentValue]) => {
      const detailLayerData = layersDataMap.get(name);
      console.assert(
        detailLayerData !== undefined,
        `Cannot find layer: ${name}`
      );

      const updateFn = (newValue: boolean) => {
        const hasLayer = map.hasLayer(detailLayerData.layer);
        if (hasLayer && !newValue) {
          map.removeLayer(detailLayerData.layer);
        } else if (!hasLayer && newValue) {
          map.addLayer(detailLayerData.layer);
        }
      };

      updateFn(currentValue.show);

      return [
        watch(ref, (newValue) => {
          updateFn(newValue);
        }),
        detailLayerData.pois,
      ] as const;
    })
  ) as [WatchStopHandle[], POIs[]];

  const cleanup = () => {
    for (const cleanupDetailLayer of cleanupDetailLayers) {
      cleanupDetailLayer();
    }
  };

  return {
    layerPOIs,
    cleanup,
  };

  function mapResourcesToRefs(
    resourceLayers: Readonly<Record<string, ResourceData>>,
    type: string
  ) {
    return Object.entries(resourceLayers).flatMap(([resource, purities]) =>
      Object.entries(purities).map(([purity, value]) => {
        return [
          `${getResourcePurityId(resource, purity)}-${type}`,
          toRef(purities[purity], "show"),
          value,
        ] as const;
      })
    );
  }
}

/* eslint-enable unicorn/no-array-method-this-argument */
