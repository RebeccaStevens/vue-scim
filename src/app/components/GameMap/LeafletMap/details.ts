import L from "leaflet";
import type { ReadonlyDeep } from "type-fest";

import icons from "~/icons";
import { getOrCreateMapElement } from "~/utils";

import type { MapVersionName } from "./map";
import * as mapUtils from "./utils";
import { convertToMapUnit } from "./utils";

type MapDetailsData = ReadonlyDeep<{
  options: Catergory[];
}>;

type Catergory =
  | CatergoryResourceNodes
  | CatergoryResourceWells
  | CatergoryPowerSlugs
  | CatergoryDropPods
  | CatergoryArtifacts
  | CatergoryCollectibles
  | CatergoryButtons;

type CatergoryPOIsBase<T extends LabeledPOIs = LabeledPOIs> = ReadonlyDeep<{
  options: Array<{
    name: string;
    options: T[];
  }>;
}>;

type CatergoryResourceBase<T extends ResourceNodes | ResourceWells> =
  CatergoryPOIsBase<T> &
    ReadonlyDeep<{
      name: string;
      options: Array<{
        type: string;
      }>;
    }>;

type CatergoryResourceNodes = CatergoryResourceBase<ResourceNodes> &
  ReadonlyDeep<{
    tabId: "resource_nodes";
  }>;

type CatergoryResourceWells = CatergoryResourceBase<ResourceWells> &
  ReadonlyDeep<{
    tabId: "resource_wells";
  }>;

type CatergoryPowerSlugs = CatergoryPOIsBase &
  ReadonlyDeep<{
    tabId: "power_slugs";
    name: string;
    options: Array<{
      type: string;
    }>;
  }>;

type CatergoryDropPods = CatergoryPOIsBase &
  ReadonlyDeep<{
    tabId: "drop_pods";
    name: string;
  }>;

type CatergoryArtifacts = CatergoryPOIsBase &
  ReadonlyDeep<{
    tabId: "artifacts";
    name: string;
  }>;

type CatergoryCollectibles = CatergoryPOIsBase &
  ReadonlyDeep<{
    tabId: "collectibles";
    name: string;
  }>;

type CatergoryButtons = ReadonlyDeep<{
  tabId?: undefined;
  button: true;
  options: Array<{
    name: string;
    options: POIs[];
  }>;
}>;

type Marker = ReadonlyDeep<{
  x: number;
  y: number;
  z: number;
}>;

type POIs = ReadonlyDeep<{
  layerId: string;
  markers: Marker[];
}>;

type SpawnLocations = POIs &
  ReadonlyDeep<{
    layerId: "spawn";
    markers: Array<{
      radius: number;
    }>;
  }>;

type LabeledPOIs = POIs &
  ReadonlyDeep<{
    icon: string;
    name: string;
    insideColor: string;
    outsideColor: string;
    markers: Array<{
      pathName: string;
      type: string;
    }>;
  }>;

type ResourceNodes = ResourcesData;
type ResourceWells = ResourcesData;

type ResourcesData = LabeledPOIs &
  ReadonlyDeep<{
    purity: string;
    markers: Array<{
      purity: string;
    }>;
  }>;

const svgIconMarker =
  '<svg viewBox="0 0 50 80" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><line x1="25" y1="40" x2="47" y2="77" stroke="{outsideColor}" stroke-width="2"/><circle cx="47" cy="77" r="3" fill="{outsideColor}"/><circle cx="23" cy="23" r="22.5" fill="{insideColor}" stroke="{outsideColor}" stroke-width="2"/><foreignObject x="8" y="8" width="32" height="32" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><img srcset="{iconImageSrcSet}" style="max-width: 100% !important" /></foreignObject></g></svg>';
const svgExtraIconMarker =
  '<svg viewBox="0 0 50 80" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><line x1="25" y1="40" x2="47" y2="77" stroke="{outsideColor}" stroke-width="2" /><circle cx="47" cy="77" r="3" fill="{outsideColor}" /><circle cx="25" cy="25" r="24" fill="{insideColor}" stroke="{outsideColor}" stroke-width="2" /><image x="7" y="7" width="36" height="36" xlink:href="{iconImage}" /><image x="30" y="30" width="24" height="24" xlink:href="{extraImage}" /></g></svg>';

function createMapIcon(pois: LabeledPOIs): () => L.DivIcon {
  return () => {
    const icon = icons.get(pois.icon);
    if (icon === undefined) {
      console.warn("Unknown icon:", pois.icon);

      return L.divIcon({
        className: "leaflet-data-marker",
        html: svgIconMarker
          .replaceAll("{outsideColor}", pois.outsideColor)
          .replaceAll("{insideColor}", "#ff0000")
          .replaceAll("{iconImageSrcSet}", ""),
        iconAnchor: [48, 78],
        iconSize: [50, 80],
      });
    }
    return L.divIcon({
      className: "leaflet-data-marker",
      html: svgIconMarker
        .replaceAll("{outsideColor}", pois.outsideColor)
        .replaceAll("{insideColor}", pois.insideColor)
        .replaceAll("{iconImageSrcSet}", icon),
      iconAnchor: [48, 78],
      iconSize: [50, 80],
    });
  };
}

/**
 * Load the detail for the map.
 *
 * @param map - The ma.
 * @param mapVersion - The version of the map to load the details of.
 */
export async function loadDetails(map: L.Map, mapVersion: MapVersionName) {
  const request = await fetch(`/data/map/${mapVersion}/details.json`);
  const details = (await request.json()) as MapDetailsData;

  const layers = new Map<string, L.LayerGroup>();
  const mapIcons = new Map<string, L.DivIcon>();

  for (const category of details.options) {
    if (isResourceNodesCatergory(category)) {
      setupResourceNodes(category, map, layers, mapIcons);
    } else if (isResourceWellsCatergory(category)) {
      setupResourceWells(category, map, layers, mapIcons);
    } else if (isCatergoryPowerSlugs(category)) {
      setupPowerSlugs(category, map, layers, mapIcons);
    } else if (isCatergoryDropPods(category)) {
      setupDropPods(category, map, layers, mapIcons);
    } else if (isCatergoryArtifacts(category)) {
      setupArtifacts(category, map, layers, mapIcons);
    } else if (isCatergoryCollectibles(category)) {
      setupCollectibles(category, map, layers, mapIcons);
    } else if (isCatergoryButtons(category)) {
      setupButtons(category, map, layers, mapIcons);
    } else {
      console.error("Unknown Point of Interest Category", category);
    }
  }

  return layers;
}

function setupResourceNodes(
  category: CatergoryResourceNodes,
  map: L.Map,
  layers: Map<string, L.LayerGroup>,
  mapIcons: Map<string, L.DivIcon>
) {
  setupResources(category, map, layers, mapIcons);
}

function setupResourceWells(
  category: CatergoryResourceWells,
  map: L.Map,
  layers: Map<string, L.LayerGroup>,
  mapIcons: Map<string, L.DivIcon>
) {
  setupResources(category, map, layers, mapIcons);
}

function setupResources(
  resources: CatergoryResourceBase<ResourceNodes | ResourceWells>,
  map: L.Map,
  layers: Map<string, L.LayerGroup>,
  mapIcons: Map<string, L.DivIcon>
) {
  setupPOIs(resources, map, layers, mapIcons);
}

function setupPowerSlugs(
  powerSlugs: CatergoryPowerSlugs,
  map: L.Map,
  layers: Map<string, L.LayerGroup>,
  mapIcons: Map<string, L.DivIcon>
) {
  setupPOIs(powerSlugs, map, layers, mapIcons);
}

function setupDropPods(
  dropPods: CatergoryDropPods,
  map: L.Map,
  layers: Map<string, L.LayerGroup>,
  mapIcons: Map<string, L.DivIcon>
) {
  setupPOIs(dropPods, map, layers, mapIcons);
}

function setupArtifacts(
  artifacts: CatergoryArtifacts,
  map: L.Map,
  layers: Map<string, L.LayerGroup>,
  mapIcons: Map<string, L.DivIcon>
) {
  setupPOIs(artifacts, map, layers, mapIcons);
}

function setupCollectibles(
  collectibles: CatergoryCollectibles,
  map: L.Map,
  layers: Map<string, L.LayerGroup>,
  mapIcons: Map<string, L.DivIcon>
) {
  setupPOIs(collectibles, map, layers, mapIcons);
}

function setupPOIs(
  objectPois: CatergoryPOIsBase,
  map: L.Map,
  layers: Map<string, L.LayerGroup>,
  mapIcons: Map<string, L.DivIcon>
) {
  for (const poisData of objectPois.options) {
    for (const pois of poisData.options) {
      const layerGroup = getOrCreateMapElement(
        layers,
        pois.layerId,
        L.layerGroup
      );

      const mapIcon = getOrCreateMapElement(
        mapIcons,
        pois.layerId,
        createMapIcon(pois)
      );

      // TODO: remove
      map.addLayer(layerGroup);

      const currentMarkerOptions = { icon: mapIcon, riseOnHover: true };

      for (const poi of pois.markers) {
        const marker = L.marker(
          mapUtils.unproject(map, [poi.x, poi.y]),
          currentMarkerOptions
        );

        marker.addTo(layerGroup);
      }
    }
  }
}

function setupButtons(
  buttons: CatergoryButtons,
  map: L.Map,
  layers: Map<string, L.LayerGroup>,
  mapIcons: Map<string, L.DivIcon>
) {
  for (const button of buttons.options) {
    for (const poi of button.options) {
      const layerGroup = getOrCreateMapElement(
        layers,
        poi.layerId,
        L.layerGroup
      );

      // TODO: remove
      // map.addLayer(layerGroup);

      if (isSpawnLocations(poi)) {
        setupSpawnLocations(poi, map, layerGroup);
      }
    }
  }
}

function setupSpawnLocations(
  spawn: SpawnLocations,
  map: L.Map,
  layerGroup: L.LayerGroup
) {
  for (const marker of spawn.markers) {
    L.circle(mapUtils.unproject(map, [marker.x, marker.y]), {
      radius: convertToMapUnit(marker.radius),
    }).addTo(layerGroup);
  }
}

function isResourceNodesCatergory(
  category: Catergory
): category is CatergoryResourceNodes {
  return category.tabId === "resource_nodes";
}

function isResourceWellsCatergory(
  category: Catergory
): category is CatergoryResourceWells {
  return category.tabId === "resource_wells";
}

function isCatergoryPowerSlugs(
  category: Catergory
): category is CatergoryPowerSlugs {
  return category.tabId === "power_slugs";
}

function isCatergoryDropPods(
  category: Catergory
): category is CatergoryDropPods {
  return category.tabId === "drop_pods";
}

function isCatergoryArtifacts(
  category: Catergory
): category is CatergoryArtifacts {
  return category.tabId === "artifacts";
}

function isCatergoryCollectibles(
  category: Catergory
): category is CatergoryCollectibles {
  return category.tabId === "collectibles";
}

function isCatergoryButtons(category: Catergory): category is CatergoryButtons {
  return category.tabId === undefined && category.button;
}

function isSpawnLocations(poi: POIs): poi is SpawnLocations {
  return poi.layerId === "spawn";
}
