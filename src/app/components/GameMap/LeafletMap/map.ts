/* eslint-disable unicorn/no-array-method-this-argument */

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import { loadDetails } from "./details";
import { getBounds, tileSize } from "./utils";

export type MapData = Readonly<{
  map: L.Map;
  layers: Map<MapVersionName[number], L.TileLayer>;
  bounds: L.LatLngBoundsExpression;
  state: {
    layer: L.Layer;
  };
}>;

export type MapVersionNames = typeof mapVersions;
export type MapVersionName = keyof MapVersionNames;
export type MapLayerName = MapVersionNames[MapVersionName][number];

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
): Promise<MapData> {
  const map = L.map(containerId, {
    crs: L.CRS.Simple,
    minZoom: zoomOptions.min,
    maxZoom: zoomOptions.max,
    zoom: zoomOptions.min,
    zoomDelta: zoomOptions.delta,
    zoomSnap: zoomOptions.snap,
    preferCanvas: true,
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
): Promise<MapData> {
  const mapVersionData = setupMapVersion(map, version);

  const layerName: MapLayerName = "gameLayer";
  const layer = mapVersionData.layers.get(layerName);
  console.assert(
    layer !== undefined,
    `Could not find the layer with name "${layerName}"`
  );

  map.addLayer(layer);

  const state: MapData["state"] = {
    layer,
  };

  await loadDetails(map, version);

  return {
    ...mapVersionData,
    map,
    state,
  };
}

/**
 * Set the active/visible layer of the leaflet map.
 *
 * @param mapData - The map data.
 * @param layerName - The name of the layer to make visible.
 */
export function setMapLayer(mapData: MapData, layerName: MapLayerName) {
  const currentLayer = mapData.layers.get(mapData.state.layer);
  if (currentLayer !== undefined) {
    mapData.map.removeLayer(currentLayer);
  }

  const newLayer = mapData.layers.get(layerName);
  console.assert(
    newLayer !== undefined,
    `Could not find the layer with name "${layerName}"`
  );

  mapData.state.layer = newLayer;
  mapData.map.addLayer(newLayer);
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
