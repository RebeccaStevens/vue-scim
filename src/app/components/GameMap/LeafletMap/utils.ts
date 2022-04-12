import type L from "leaflet";

import * as gameMap from "./gameMap";

type GamePointTuple = [x: number, y: number];

export const tileSize = 256;
export const zoomRatio = Math.ceil(
  Math.log(gameMap.size / tileSize) / Math.log(2)
);

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

export function unproject(map: L.Map, point: GamePointTuple) {
  return unprojectMapPoint(map, convertToMapPoint(point));
}

export function unprojectMapPoint(map: L.Map, point: L.PointExpression) {
  return map.unproject(point, zoomRatio);
}

export function project(map: L.Map, latLng: L.LatLngExpression) {
  return map.project(latLng, zoomRatio);
}

export function getBounds(map: L.Map): L.LatLngBoundsLiteral {
  const southWest = unprojectMapPoint(map, [0, gameMap.size]);
  const northEast = unprojectMapPoint(map, [gameMap.size, 0]);

  return [
    [southWest.lat, southWest.lng],
    [northEast.lat, northEast.lng],
  ];
}

export function getCenter(map: L.Map) {
  return map.unproject([gameMap.size / 2, gameMap.size / 2], zoomRatio);
}

export function convertToMapPoint(point: GamePointTuple): L.PointTuple {
  return [
    ((gameMap.centerX + point[0]) * gameMap.size) / gameMap.width,
    ((gameMap.centerY + point[1]) * gameMap.size) / gameMap.height,
  ];
}

export function convertToGamePoint(point: L.PointTuple): GamePointTuple {
  return [
    (point[0] * gameMap.width) / gameMap.size - gameMap.centerX,
    (point[1] * gameMap.height) / gameMap.size - gameMap.centerY,
  ];
}
