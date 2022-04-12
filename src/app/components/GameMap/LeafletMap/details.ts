import L from "leaflet";
import type { ReadonlyDeep } from "type-fest";

import { getOrCreateMapElement } from "~/utils";

import type { MapVersionName } from "./map";
import * as mapUtils from "./utils";

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

type CatergoryResourceBase<T extends ResourceNodes | ResourceWells> =
  ReadonlyDeep<{
    name: string;
    options: Array<{
      name: string;
      type: string;
      options: T[];
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

type CatergoryPowerSlugs = ReadonlyDeep<{
  tabId: "power_slugs";
  name: string;
  options: Array<{
    name: string;
    type: string;
    options: LabeledPOIs[];
  }>;
}>;

type CatergoryDropPods = ReadonlyDeep<{
  tabId: "drop_pods";
  name: string;
  options: Array<{
    name: string;
    options: LabeledPOIs[];
  }>;
}>;

type CatergoryArtifacts = ReadonlyDeep<{
  tabId: "artifacts";
  name: string;
  options: Array<{
    name: string;
    options: LabeledPOIs[];
  }>;
}>;

type CatergoryCollectibles = ReadonlyDeep<{
  tabId: "collectibles";
  name: string;
  options: Array<{
    name: string;
    options: LabeledPOIs[];
  }>;
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
  '<svg viewBox="0 0 50 80" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><line x1="25" y1="40" x2="47" y2="77" stroke="{outsideColor}" stroke-width="2" /><circle cx="47" cy="77" r="3" fill="{outsideColor}" /><circle cx="25" cy="25" r="24" fill="{insideColor}" stroke="{outsideColor}" stroke-width="2" /><image x="7" y="7" width="36" height="36" xlink:href="{iconImage}" /></g></svg>';
const svgExtraIconMarker =
  '<svg viewBox="0 0 50 80" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><line x1="25" y1="40" x2="47" y2="77" stroke="{outsideColor}" stroke-width="2" /><circle cx="47" cy="77" r="3" fill="{outsideColor}" /><circle cx="25" cy="25" r="24" fill="{insideColor}" stroke="{outsideColor}" stroke-width="2" /><image x="7" y="7" width="36" height="36" xlink:href="{iconImage}" /><image x="30" y="30" width="24" height="24" xlink:href="{extraImage}" /></g></svg>';

/**
 * Load the detail for the map.
 *
 * @param map - The ma.
 * @param mapVersion - The version of the map to load the details of.
 */
export async function loadDetails(map: L.Map, mapVersion: MapVersionName) {
  const { default: details } = (await import(
    `./gameMap/${mapVersion}/details.json`
  )) as { default: MapDetailsData };

  const layers = new Map<string, L.LayerGroup>();
  const icons = new Map<string, L.DivIcon>();

  for (const category of details.options) {
    if (isResourceNodesCatergory(category)) {
      setupResourceNodes(category, map, layers, icons);
    } else if (isResourceWellsCatergory(category)) {
      setupResourceWells(category, map, layers, icons);
    } else if (isCatergoryPowerSlugs(category)) {
      setupPowerSlugs(category, map, layers, icons);
    } else if (isCatergoryDropPods(category)) {
      setupDropPods(category, map, layers, icons);
    } else if (isCatergoryArtifacts(category)) {
      setupArtifacts(category, map, layers, icons);
    } else if (isCatergoryCollectibles(category)) {
      setupCollectibles(category, map, layers, icons);
    } else if (isCatergoryButtons(category)) {
      setupButtons(category, map, layers, icons);
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
  icons: Map<string, L.DivIcon>
) {
  setupResources(category, map, layers, icons);
}

function setupResourceWells(
  category: CatergoryResourceWells,
  map: L.Map,
  layers: Map<string, L.LayerGroup>,
  icons: Map<string, L.DivIcon>
) {
  setupResources(category, map, layers, icons);
}

function setupResources(
  resources: CatergoryResourceBase<ResourceNodes | ResourceWells>,
  map: L.Map,
  layers: Map<string, L.LayerGroup>,
  icons: Map<string, L.DivIcon>
) {}

function setupPowerSlugs(
  powerSlugs: CatergoryPowerSlugs,
  map: L.Map,
  layers: Map<string, L.LayerGroup>,
  icons: Map<string, L.DivIcon>
) {
  for (const powerSlug of powerSlugs.options) {
    for (const pois of powerSlug.options) {
      const layerGroup = getOrCreateMapElement(
        layers,
        pois.layerId,
        L.layerGroup
      );

      const icon = getOrCreateMapElement(icons, pois.layerId, () =>
        L.divIcon({
          className: "leaflet-data-marker",
          html: svgIconMarker
            .replaceAll("{outsideColor}", pois.outsideColor)
            .replaceAll("{insideColor}", pois.insideColor)
            .replaceAll("{iconImage}", pois.icon),
          iconAnchor: [48, 78],
          iconSize: [50, 80],
        })
      );

      // TODO: remove
      map.addLayer(layerGroup);

      const currentMarkerOptions = { icon, riseOnHover: true };

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

function setupDropPods(
  dropPods: CatergoryDropPods,
  map: L.Map,
  layers: Map<string, L.LayerGroup>,
  icons: Map<string, L.DivIcon>
) {}

function setupArtifacts(
  artifacts: CatergoryArtifacts,
  map: L.Map,
  layers: Map<string, L.LayerGroup>,
  icons: Map<string, L.DivIcon>
) {}

function setupCollectibles(
  collectibles: CatergoryCollectibles,
  map: L.Map,
  layers: Map<string, L.LayerGroup>,
  icons: Map<string, L.DivIcon>
) {}

function setupButtons(
  buttons: CatergoryButtons,
  map: L.Map,
  layers: Map<string, L.LayerGroup>,
  icons: Map<string, L.DivIcon>
) {
  for (const button of buttons.options) {
    for (const poi of button.options) {
      const layerGroup = getOrCreateMapElement(
        layers,
        poi.layerId,
        L.layerGroup
      );

      // TODO: remove
      map.addLayer(layerGroup);

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
      radius: marker.radius,
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
