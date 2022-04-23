import L from "leaflet";
import type { ReadonlyDeep } from "type-fest";

import type { GamePointTuple } from "~/components/GameMap/types";
import icons from "~/icons";
import { getOrCreateMapElement } from "~/utils";

import { polygonLine } from "./draw-extendsions";
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

type LayerEntity = ReadonlyDeep<{
  layerId: string;
}>;

type POIs = LayerEntity &
  ReadonlyDeep<{
    markers: Marker[];
  }>;

type PointMarkers = POIs &
  ReadonlyDeep<{
    markers: Array<{
      radius: number;
    }>;
  }>;

type SpawnLocations = PointMarkers &
  ReadonlyDeep<{
    layerId: "spawn";
  }>;

type WorldBorder = LayerEntity &
  ReadonlyDeep<{
    layerId: "worldBorder";
    polygon: GamePointTuple[];
  }>;

type Caves = LayerEntity &
  ReadonlyDeep<{
    layerId: "caves";
    markers: Record<
      string,
      {
        entrances: GamePointTuple[][];
        points: GamePointTuple[];
      }
    >;
  }>;

type Roads = LayerEntity &
  ReadonlyDeep<{
    layerId: "roads";
    markers: Record<
      string,
      {
        points: GamePointTuple[];
        corridor?: number;
      }
    >;
  }>;

type SporeFlowers = PointMarkers &
  ReadonlyDeep<{
    layerId: "sporeFlowers";
  }>;

type GasPillars = PointMarkers &
  ReadonlyDeep<{
    layerId: "pillars";
  }>;

type SmallRocks = PointMarkers &
  ReadonlyDeep<{
    layerId: "smallRocks";
  }>;

type LargeRocks = PointMarkers &
  ReadonlyDeep<{
    layerId: "largeRocks";
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
      setupButtons(category, map, layers);
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
  layers: Map<string, L.LayerGroup>
) {
  for (const button of buttons.options) {
    for (const entity of button.options) {
      const layerGroup = getOrCreateMapElement(
        layers,
        entity.layerId,
        L.layerGroup
      );

      if (isSpawnLocations(entity)) {
        setupSpawnLocations(entity, map, layerGroup);
      } else if (isWorldBorder(entity)) {
        setupWorldBorder(entity, map, layerGroup);
      } else if (isCaves(entity)) {
        setupCaves(entity, map, layerGroup);
      } else if (isRoads(entity)) {
        setupRoads(entity, map, layerGroup);
      } else if (isSporeFlowers(entity)) {
        setupSporeFlowers(entity, map, layerGroup);
      } else if (isGasPillars(entity)) {
        setupPillars(entity, map, layerGroup);
      } else if (isSmallRocks(entity)) {
        setupSmallRocks(entity, map, layerGroup);
      } else if (isLargeRocks(entity)) {
        setupLargeRocks(entity, map, layerGroup);
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

function setupWorldBorder(
  border: WorldBorder,
  map: L.Map,
  layerGroup: L.LayerGroup
) {
  L.polyline(
    border.polygon.map((point) => mapUtils.unproject(map, point)),
    {
      color: "red",
      weight: 3,
      interactive: false,
    }
  ).addTo(layerGroup);
}

function setupCaves(caves: Caves, map: L.Map, layerGroup: L.LayerGroup) {
  for (const marker of Object.values(caves.markers)) {
    const polygonPoints = marker.points.map((value) =>
      mapUtils.unproject(map, value)
    );

    L.polygon(polygonPoints, {
      color: "yellow",
      weight: 1,
      interactive: false,
    }).addTo(layerGroup);

    for (const entrance of marker.entrances) {
      const entrancePolyline = polygonLine(
        entrance.map((point) => mapUtils.unproject(map, point)),
        {
          color: "yellow",
          minWeight: 3,
          weight: 250,
          dashArray: "100 100",
          interactive: false,
        }
      );

      // TODO: entrance height

      entrancePolyline.addTo(layerGroup);
    }
  }
}

function setupRoads(roads: Roads, map: L.Map, layerGroup: L.LayerGroup) {
  for (const marker of Object.values(roads.markers)) {
    const points = marker.points.map((value) => mapUtils.unproject(map, value));

    const roadPolyline = polygonLine(points, {
      color: "purple",
      weight: marker.corridor ?? 2500,
      interactive: false,
    });

    roadPolyline.addTo(layerGroup);
  }
}

function setupSporeFlowers(
  sporeFlowers: SporeFlowers,
  map: L.Map,
  layerGroup: L.LayerGroup
) {
  const options: L.CircleMarkerOptions = {
    radius: 2,
    color: "#9cbc7d",
    fillOpacity: 0.5,
    stroke: false,
  };
  setupPointMarkers(sporeFlowers, map, layerGroup, options);
}

function setupPillars(
  pillars: GasPillars,
  map: L.Map,
  layerGroup: L.LayerGroup
) {
  const options: L.CircleMarkerOptions = {
    radius: 2,
    color: "#bee597",
    fillOpacity: 0.75,
    stroke: false,
  };
  setupPointMarkers(pillars, map, layerGroup, options);
}

function setupSmallRocks(
  smallRocks: SmallRocks,
  map: L.Map,
  layerGroup: L.LayerGroup
) {
  const options: L.CircleMarkerOptions = {
    radius: 0.5,
    color: "#555555",
    fillOpacity: 0.75,
    stroke: false,
  };
  setupPointMarkers(smallRocks, map, layerGroup, options);
}

function setupLargeRocks(
  largeRocks: LargeRocks,
  map: L.Map,
  layerGroup: L.LayerGroup
) {
  const options: L.CircleMarkerOptions = {
    radius: 1.2,
    color: "#555555",
    fillOpacity: 0.75,
    stroke: false,
  };
  setupPointMarkers(largeRocks, map, layerGroup, options);
}

function setupPointMarkers(
  point: PointMarkers,
  map: L.Map,
  layerGroup: L.LayerGroup,
  options: L.CircleMarkerOptions
) {
  for (const marker of Object.values(point.markers)) {
    const polygon = L.circle(
      mapUtils.unproject(map, [marker.x, marker.y]),
      options
    );

    polygon.addTo(layerGroup);
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

function isSpawnLocations(entity: LayerEntity): entity is SpawnLocations {
  return entity.layerId === "spawn";
}

function isWorldBorder(entity: LayerEntity): entity is WorldBorder {
  return entity.layerId === "worldBorder";
}

function isCaves(entity: LayerEntity): entity is Caves {
  return entity.layerId === "caves";
}

function isRoads(entity: LayerEntity): entity is Roads {
  return entity.layerId === "roads";
}

function isSporeFlowers(entity: LayerEntity): entity is SporeFlowers {
  return entity.layerId === "sporeFlowers";
}

function isGasPillars(entity: LayerEntity): entity is GasPillars {
  return entity.layerId === "pillars";
}

function isSmallRocks(entity: LayerEntity): entity is SmallRocks {
  return entity.layerId === "smallRocks";
}

function isLargeRocks(entity: LayerEntity): entity is LargeRocks {
  return entity.layerId === "largeRocks";
}
