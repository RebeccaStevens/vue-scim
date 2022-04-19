import L from "leaflet";
import type { ReadonlyDeep } from "type-fest";

import type { GamePointTuple } from "~/components/GameMap/types";

import * as gameMap from "./gameMap";

export const tileSize = 256;

// The width of the map at zoom 1 in pixels.
const fullSize = 4 * tileSize;
const zoomRatio = 1;

export function pauseMap(map: L.Map) {
  map.dragging.disable();
  map.keyboard.disable();
  map.touchZoom.disable();
  map.doubleClickZoom.disable();
  map.scrollWheelZoom.disable();
  map.boxZoom.disable();
}

export function unpauseMap(map: L.Map) {
  map.dragging.enable();
  map.keyboard.enable();
  map.touchZoom.enable();
  map.doubleClickZoom.enable();
  map.scrollWheelZoom.enable();
  map.boxZoom.enable();
}

export function unproject(map: L.Map, point: ReadonlyDeep<GamePointTuple>) {
  return unprojectMapPoint(map, convertToMapPoint(point));
}

export function unprojectMapPoint(map: L.Map, point: L.PointExpression) {
  return map.unproject(point, zoomRatio);
}

export function project(map: L.Map, latLng: L.LatLngExpression) {
  return map.project(latLng, zoomRatio);
}

export function getBounds(map: L.Map) {
  const southWest = unprojectMapPoint(map, [0, fullSize]);
  const northEast = unprojectMapPoint(map, [fullSize, 0]);

  return new L.LatLngBounds(
    [southWest.lat, southWest.lng],
    [northEast.lat, northEast.lng]
  );
}

export function getCenter(map: L.Map) {
  return map.unproject([fullSize / 2, fullSize / 2], zoomRatio);
}

export function convertToMapPoint(
  point: ReadonlyDeep<GamePointTuple>
): L.PointTuple {
  return [
    convertToMapUnit(point[0] + gameMap.centerX),
    convertToMapUnit(point[1] + gameMap.centerY),
  ];
}

export function convertToGamePoint(point: L.PointTuple): GamePointTuple {
  return [
    convertToGameUnit(point[0]) - gameMap.centerX,
    convertToGameUnit(point[1]) - gameMap.centerY,
  ];
}

export function convertToMapUnit(length: number) {
  return (length * fullSize) / gameMap.width;
}

export function convertToGameUnit(length: number) {
  return (length * gameMap.width) / fullSize;
}
