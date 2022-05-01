import L from "leaflet";
import type { ReadonlyDeep } from "type-fest";

import type { GamePointTuple } from "~/components/GameMap/types";
import icons from "~/icons";
import { LayerButtonGroup, useMapDataStore } from "~/stores/map-data";
import { getOrCreateMapElement, getPOIsId } from "~/utils";

import { polygonLine } from "./draw-extendsions";
import * as mapUtils from "./utils";
import { convertToMapUnit } from "./utils";

const mapDataStore = useMapDataStore();

export type LayersDataMap = Map<
  string,
  { layer: L.LayerGroup; pois: POIs; type: string }
>;

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
  type: string;
}>;

export type POIs = LayerEntity &
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
    type: "spawn";
  }>;

type WorldBorder = LayerEntity &
  ReadonlyDeep<{
    type: "worldBorder";
    polygon: GamePointTuple[];
  }>;

type Caves = LayerEntity &
  ReadonlyDeep<{
    type: "caves";
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
    type: "roads";
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
    type: "sporeFlowers";
  }>;

type GasPillars = PointMarkers &
  ReadonlyDeep<{
    type: "pillars";
  }>;

type SmallRocks = PointMarkers &
  ReadonlyDeep<{
    type: "smallRocks";
  }>;

type LargeRocks = PointMarkers &
  ReadonlyDeep<{
    type: "largeRocks";
  }>;

export type LabeledPOIs = POIs &
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
    type: string;
    purity: string;
  }>;

const svgIconMarker =
  '<svg viewBox="0 0 50 80" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><line x1="25" y1="40" x2="47" y2="77" stroke="{outsideColor}" stroke-width="2"/><circle cx="47" cy="77" r="3" fill="{outsideColor}"/><circle cx="23" cy="23" r="22.5" fill="{insideColor}" stroke="{outsideColor}" stroke-width="2"/><foreignObject x="8" y="8" width="32" height="32" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><img srcset="{iconImageSrcset}" style="max-width: 100% !important" /></foreignObject></g></svg>';
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
          .replaceAll("{iconImageSrcset}", ""),
        iconAnchor: [48, 78],
        iconSize: [50, 80],
      });
    }
    return L.divIcon({
      className: "leaflet-data-marker",
      html: svgIconMarker
        .replaceAll("{outsideColor}", pois.outsideColor)
        .replaceAll("{insideColor}", pois.insideColor)
        .replaceAll("{iconImageSrcset}", icon),
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
export async function loadDetails(
  map: L.Map,
  mapVersion: typeof mapDataStore.mapVersion
) {
  const request = await fetch(`/data/map/${mapVersion}/details.json`);
  const details = (await request.json()) as MapDetailsData;

  const layers: LayersDataMap = new Map();
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

  const iconsToRegister = [...layers.values()]
    .map((data) => {
      if (isResourcesData(data.pois)) {
        if (data.type !== "nodes" && data.type !== "wells") {
          return undefined;
        }
        return [
          data.type,
          [data.pois.type, data.pois.purity, icons.get(data.pois.icon)],
        ] as const;
      }
      return undefined;
    })
    .filter(
      (value): value is ["nodes" | "wells", [string, string, string]] =>
        value?.[1][1] !== undefined
    );

  for (const [type, [resource, purity, srcset]] of iconsToRegister) {
    mapDataStore.registerLayerIcon(getPOIsId(type, resource, purity), srcset);
  }

  return layers;
}

function setupResourceNodes(
  nodes: CatergoryResourceNodes,
  map: L.Map,
  layersData: LayersDataMap,
  mapIcons: Map<string, L.DivIcon>
) {
  setupResources(
    nodes,
    map,
    layersData,
    mapIcons,
    LayerButtonGroup.ResourceNodes
  );
}

function setupResourceWells(
  wells: CatergoryResourceWells,
  map: L.Map,
  layersData: LayersDataMap,
  mapIcons: Map<string, L.DivIcon>
) {
  setupResources(
    wells,
    map,
    layersData,
    mapIcons,
    LayerButtonGroup.ResourceWells
  );
}

function setupResources(
  resources: CatergoryResourceBase<ResourceNodes | ResourceWells>,
  map: L.Map,
  layersData: LayersDataMap,
  mapIcons: Map<string, L.DivIcon>,
  group: LayerButtonGroup
) {
  setupPOIs(resources, map, layersData, mapIcons, group);
}

function setupPowerSlugs(
  powerSlugs: CatergoryPowerSlugs,
  map: L.Map,
  layersData: LayersDataMap,
  mapIcons: Map<string, L.DivIcon>
) {
  setupCollectiblePOIs(powerSlugs, map, layersData, mapIcons);
}

function setupDropPods(
  dropPods: CatergoryDropPods,
  map: L.Map,
  layersData: LayersDataMap,
  mapIcons: Map<string, L.DivIcon>
) {
  setupCollectiblePOIs(dropPods, map, layersData, mapIcons);
}

function setupArtifacts(
  artifacts: CatergoryArtifacts,
  map: L.Map,
  layersData: LayersDataMap,
  mapIcons: Map<string, L.DivIcon>
) {
  setupCollectiblePOIs(artifacts, map, layersData, mapIcons);
}

function setupCollectibles(
  collectibles: CatergoryCollectibles,
  map: L.Map,
  layersData: LayersDataMap,
  mapIcons: Map<string, L.DivIcon>
) {
  setupCollectiblePOIs(collectibles, map, layersData, mapIcons);
}

function setupCollectiblePOIs(
  collectibles: CatergoryPOIsBase,
  map: L.Map,
  layersData: LayersDataMap,
  mapIcons: Map<string, L.DivIcon>
) {
  setupPOIs(
    collectibles,
    map,
    layersData,
    mapIcons,
    LayerButtonGroup.Collectibles
  );
}

function setupPOIs(
  objectPois: CatergoryPOIsBase,
  map: L.Map,
  layersData: LayersDataMap,
  mapIcons: Map<string, L.DivIcon>,
  group: LayerButtonGroup
) {
  for (const poisData of objectPois.options) {
    for (const pois of poisData.options) {
      const id = getPOIsId(
        group,
        pois.type,
        (pois as { purity?: string }).purity
      );

      mapDataStore.registerMarkerCount(id, pois.markers.length);

      const layerData = getOrCreateMapElement(layersData, id, () => ({
        layer: L.layerGroup(),
        pois,
        type: group,
      }));

      const mapIcon = getOrCreateMapElement(mapIcons, id, createMapIcon(pois));

      const currentMarkerOptions = { icon: mapIcon, riseOnHover: true };

      for (const poi of pois.markers) {
        const marker = L.marker(
          mapUtils.unproject(map, [poi.x, poi.y]),
          currentMarkerOptions
        );

        marker.addTo(layerData.layer);
      }
    }
  }
}

function setupButtons(
  buttons: CatergoryButtons,
  map: L.Map,
  layersData: LayersDataMap
) {
  for (const button of buttons.options) {
    for (const entity of button.options) {
      const id = getPOIsId(LayerButtonGroup.Details, entity.type);

      const layerData = getOrCreateMapElement(layersData, id, () => ({
        layer: L.layerGroup(),
        pois: entity,
      }));

      if (isSpawnLocations(entity)) {
        setupSpawnLocations(entity, map, layerData.layer);
      } else if (isWorldBorder(entity)) {
        setupWorldBorder(entity, map, layerData.layer);
      } else if (isCaves(entity)) {
        setupCaves(entity, map, layerData.layer);
      } else if (isRoads(entity)) {
        setupRoads(entity, map, layerData.layer);
      } else if (isSporeFlowers(entity)) {
        setupSporeFlowers(entity, map, layerData.layer);
      } else if (isGasPillars(entity)) {
        setupPillars(entity, map, layerData.layer);
      } else if (isSmallRocks(entity)) {
        setupSmallRocks(entity, map, layerData.layer);
      } else if (isLargeRocks(entity)) {
        setupLargeRocks(entity, map, layerData.layer);
      }
    }
  }
}

function setupSpawnLocations(
  spawn: SpawnLocations,
  map: L.Map,
  layerGroup: L.LayerGroup
) {
  const id = getPOIsId(LayerButtonGroup.Details, spawn.type);
  mapDataStore.registerMarkerCount(id, spawn.markers.length);

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
  const markers = Object.values(caves.markers);

  const id = getPOIsId(LayerButtonGroup.Details, caves.type);
  mapDataStore.registerMarkerCount(id, markers.length);

  for (const marker of markers) {
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
  const markers = Object.values(roads.markers);

  const id = getPOIsId(LayerButtonGroup.Details, roads.type);
  mapDataStore.registerMarkerCount(id, markers.length);

  for (const marker of markers) {
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
  const id = getPOIsId(LayerButtonGroup.Details, point.type);
  mapDataStore.registerMarkerCount(id, point.markers.length);

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
  return entity.type === "spawn";
}

function isWorldBorder(entity: LayerEntity): entity is WorldBorder {
  return entity.type === "worldBorder";
}

function isCaves(entity: LayerEntity): entity is Caves {
  return entity.type === "caves";
}

function isRoads(entity: LayerEntity): entity is Roads {
  return entity.type === "roads";
}

function isSporeFlowers(entity: LayerEntity): entity is SporeFlowers {
  return entity.type === "sporeFlowers";
}

function isGasPillars(entity: LayerEntity): entity is GasPillars {
  return entity.type === "pillars";
}

function isSmallRocks(entity: LayerEntity): entity is SmallRocks {
  return entity.type === "smallRocks";
}

function isLargeRocks(entity: LayerEntity): entity is LargeRocks {
  return entity.type === "largeRocks";
}

function isLabeldPOIs(pois: POIs): pois is LabeledPOIs {
  return Object.hasOwn(pois, "name");
}

function isResourcesData(pois: POIs): pois is ResourcesData {
  return (
    isLabeldPOIs(pois) &&
    Object.hasOwn(pois, "type") &&
    Object.hasOwn(pois, "purity")
  );
}
