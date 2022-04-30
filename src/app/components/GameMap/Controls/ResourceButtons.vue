<script setup lang="ts">
import type {
  ResourceLayerData,
  ResourceName,
  ResourceNodeName,
  ResourceWellName,
  ResourceType,
} from "~/stores/map-data";
import { useMapDataStore } from "~/stores/map-data";

export type Props = {
  resource: ResourceName;
  resourceLayerData: ResourceLayerData;
  type: ResourceType;
};

const props = defineProps<Props>();

const { t } = useI18n();

const mapDataStore = useMapDataStore();

const toggleResourceGroup = (resource: ResourceName) => {
  const layers = Object.entries(
    props.type === "node"
      ? mapDataStore.resourceNodeLayers[resource as ResourceNodeName]
      : mapDataStore.resourceWellLayers[resource as ResourceWellName]
  );
  const state = layers.every(([purity, data]) => data.show);
  for (const [purity] of layers) {
    mapDataStore.setResourceLayer(props.type, resource, purity, !state);
  }
};

// TODO: count.
const count = 10;
</script>

<template>
  <div class="resource-button">
    <q-btn
      class="label"
      flat
      align="left"
      :label="t(`resources.resource.${resource}.name`)"
      :title="
        resource === 'geyser'
          ? t(`pages.interactive-map.controls.static-elements.${type}.toggle-geyser.layers.title`)
          : t(
              `pages.interactive-map.controls.static-elements.${type}.toggle.layers.title`,
              {
                resource: `resources.resource.${resource}.name`,
                type: `resources.types.${type}.short-name`,
              },
              count
            )
      "
      @click="toggleResourceGroup(resource)"
    />
    <ImageToggleButton
      v-for="[purity, { show, iconSrcset }] in Object.entries(resourceLayerData)"
      :key="purity"
      :class="purity"
      :srcset="iconSrcset"
      :value="show"
      :title="
        resource === 'geyser'
          ? t(`pages.interactive-map.controls.static-elements.${type}.toggle-geyser.layer.title`, {
              purity: `resources.purities.${purity}.name`,
            })
          : t(
              `pages.interactive-map.controls.static-elements.${type}.toggle.layer.title`,
              {
                resource: `resources.resource.${resource}.name`,
                purity: `resources.purities.${purity}.name`,
                type: `resources.types.${type}.short-name`,
              },
              count
            )
      "
      @change="mapDataStore.toggleResourceLayer(type, resource, purity)"
    />
  </div>
</template>

<style scoped lang="scss">
.resource-button {
  display: grid;
  grid-template-columns: 1fr repeat(3, min-content);
  gap: 0.25rem;
  align-items: center;
}

.label,
.image-toggle-button {
  height: 3.25rem;
}

.image-toggle-button {
  aspect-ratio: 1;
  background-color: var(--purity-dull-color);

  &.q-btn--active {
    background-color: var(--purity-color);
  }

  &::before {
    border: solid 0.15rem var(--purity-color, $primary);
  }

  :deep(.q-btn__content) {
    margin: 0.125rem;
    border-radius: 50%;
  }

  :deep(.q-img__container) {
    margin: 0.125rem;
  }

  :deep(.q-img__image) {
    filter: drop-shadow(0 0 0.2rem white) drop-shadow(0 0 0.2rem white);
    border-radius: 0;
  }
}
</style>
