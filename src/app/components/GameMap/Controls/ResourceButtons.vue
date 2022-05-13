<script setup lang="ts">
import type { ResourceName, ResourceType, PurityLayerButtonData } from "~/stores/map-data";
import { useMapDataStore } from "~/stores/map-data";

export type Props = {
  resource: ResourceName;
  resourceLayerData: PurityLayerButtonData;
  type: ResourceType;
};

const props = defineProps<Props>();

const { t } = useI18n();

const mapDataStore = useMapDataStore();

const toggleResourceGroup = () => {
  const state = props.resourceLayerData.every((data) => data.show);
  for (const data of props.resourceLayerData) {
    mapDataStore.setLayerVisibility(data.id, !state);
  }
};
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
          ? t(
              `pages.interactive-map.controls.static-elements.${type}.toggle-geyser.layers.title`,
              resourceLayerData.reduce((sum, data) => sum + (data.markerCount ?? 0), 0)
            )
          : t(
              `pages.interactive-map.controls.static-elements.${type}.toggle.layers.title`,
              {
                resource: `resources.resource.${resource}.name`,
                type: `resources.types.${type}.short-name`,
              },
              resourceLayerData.reduce((sum, data) => sum + (data.markerCount ?? 0), 0)
            )
      "
      @click="toggleResourceGroup()"
    />
    <ImageToggleButton
      v-for="{ id, resource, purity, show, iconSrcset, markerCount } in resourceLayerData"
      :key="purity"
      :class="purity"
      :srcset="iconSrcset"
      :value="show"
      :count="markerCount"
      :disabled="markerCount === 0"
      :title="
        resource === 'geyser'
          ? t(
              `pages.interactive-map.controls.static-elements.${type}.toggle-geyser.layer.title`,
              {
                purity: `resources.purities.${purity}.name`,
              },
              markerCount ?? 0
            )
          : t(
              `pages.interactive-map.controls.static-elements.${type}.toggle.layer.title`,
              {
                resource: `resources.resource.${resource}.name`,
                purity: `resources.purities.${purity}.name`,
                type: `resources.types.${type}.short-name`,
              },
              markerCount ?? 0
            )
      "
      @change="mapDataStore.toggleLayerVisibility(id)"
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
  background-color: var(--purity-pale-color);

  $margin: 0.125rem;

  &:not(:disabled).q-btn--active {
    background-color: var(--purity-color);
  }

  &::before {
    border: solid 0.15rem var(--purity-color, $primary);
  }

  &:active::before,
  &.q-btn--active::before {
    border-bottom-width: 0.15rem;
  }

  :deep(.q-btn__content) {
    margin: $margin;
    border-radius: 50%;
  }

  :deep(.q-img__container) {
    margin: $margin;
  }

  :deep(.q-badge) {
    $border-width: 0.075rem;

    margin: $margin - $border-width;
    border-color: var(--purity-color, $primary);
    border-width: $border-width;
    --badge-width: 2ch;
  }

  :deep(.q-img__image) {
    filter: drop-shadow(0 0 0.2rem white) drop-shadow(0 0 0.2rem white);
    border-radius: 0;
  }
}
</style>
