/* eslint-disable unicorn/no-array-method-this-argument */

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import { useMapDataStore } from "~/stores/map-data";

import { loadDetails } from "./details";
import { getBounds, tileSize } from "./utils";

export type MapInstance = Readonly<{
  map: L.Map;
  layers: Map<MapVersionName[number], L.TileLayer>;
  bounds: L.LatLngBoundsExpression;
  state: {
    layerName: MapVersionName[number];
  };
  cleanup: () => void;
}>;

export type MapVersionNames = typeof mapVersions;
export type MapVersionName = keyof MapVersionNames;
export type MapLayerName = MapVersionNames[MapVersionName][number];

const mapDataStore = useMapDataStore();

const mapVersions = {
  EarlyAccess: ["gameLayer", "realisticLayer"],
} as const;

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
export async function createMap(
  containerId: string,
  versionName: MapVersionName
): Promise<MapInstance> {
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
export async function setMapVersion(
  map: L.Map,
  version: MapVersionName
): Promise<MapInstance> {
  const mapVersionData = setupMapVersion(map, version);

  const layerName = mapDataStore.backgroundLayer;
  const layer = mapVersionData.layers.get(layerName);
  console.assert(
    layer !== undefined,
    `Could not find the layer with name "${layerName}"`
  );

  map.addLayer(layer);

  const state: MapInstance["state"] = {
    layerName,
  };

  const detailLayers = await loadDetails(map, version);

  const detailLayersRefs = toRefs(mapDataStore.detailLayers);

  const cleanupDetailLayers = Object.entries(mapDataStore.detailLayers).map(
    ([name, currentValue]) => {
      const detailLayer = detailLayers.get(name);
      console.assert(detailLayer !== undefined, `Cannot find layer: ${name}`);

      const updateFn = (newValue: boolean) => {
        const hasLayer = map.hasLayer(detailLayer);
        if (hasLayer && !newValue) {
          map.removeLayer(detailLayer);
        } else if (!hasLayer && newValue) {
          map.addLayer(detailLayer);
        }
      };

      updateFn(currentValue);

      return watch(detailLayersRefs[name], (newValue) => {
        updateFn(newValue);
      });
    }
  );
  const cleanup = () => {
    for (const cleanupDetailLayer of cleanupDetailLayers) {
      cleanupDetailLayer();
    }
  };

  return {
    ...mapVersionData,
    map,
    state,
    cleanup,
  };
}

/**
 * Set the active/visible layer of the leaflet map.
 *
 * @param mapInstance - The map data.
 * @param layerName - The name of the layer to make visible.
 */
export function setMapLayer(mapInstance: MapInstance, layerName: MapLayerName) {
  const currentLayer = mapInstance.layers.get(mapInstance.state.layerName);
  if (currentLayer !== undefined) {
    mapInstance.map.removeLayer(currentLayer);
  }

  const newLayer = mapInstance.layers.get(layerName);
  console.assert(
    newLayer !== undefined,
    `Could not find the layer with name "${layerName}"`
  );

  mapInstance.state.layerName = layerName;
  mapInstance.map.addLayer(newLayer);
}

/**
 * Setup the map for the given version.
 *
 * @param map - The map.
 * @param version - The name of the map version.
 */
function setupMapVersion(map: L.Map, version: MapVersionName) {
  const bounds = getBounds(map);
  map.setMaxBounds(bounds.pad(0.1));
  map.fitBounds(bounds);

  const layers = setupMapLayers(version, bounds);

  return {
    bounds,
    layers,
  };
}

/**
 * Setup the layers of the leaflet map.
 *
 * @param version - The version of the map to create the layers for.
 * @param bounds - The bounds of the leaflet map.
 * @returns The layers of the map.
 */
function setupMapLayers(
  version: MapVersionName,
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
    mapVersions[version].map((layer) => [
      layer,
      L.tileLayer(`/img/map/${version}/${layer}/{z}/{x}/{y}.webp`, options),
    ])
  );
}

/* eslint-enable unicorn/no-array-method-this-argument */
