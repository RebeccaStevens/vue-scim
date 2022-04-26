<script setup lang="ts">
import * as icons from "~/raw/img/icons";
import { useMapDataStore } from "~/stores/map-data";

const { t } = useI18n();
const tab = ref("details");

const mapDataStore = useMapDataStore();

const backgroundLayer = toRef(mapDataStore, "backgroundLayer");
const detailLayers = toRefs(mapDataStore.detailLayers);
const resourceNodeLayers = toRefs(mapDataStore.resourceNodeLayers);
const resourceWellLayers = toRefs(mapDataStore.resourceWellLayers);
</script>

<template>
  <q-card-section>
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      narrow-indicator
      left-icon="i-carbon-arrow-left"
      right-icon="i-carbon-arrow-right"
      no-caps
    >
      <q-tab name="details" :label="t('Map layers')" />
      <q-tab name="nodes" :label="t('Resource Nodes')" />
      <q-tab name="wells" :label="t('Resource Wells')" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="details" class="details-layers">
        <div class="background-layer-options">
          <ImageToggleButton
            class="option"
            :srcSet="icons.map.gameLayer"
            :value="backgroundLayer === 'gameLayer'"
            @change="(value: boolean) => {
              if (value) {
                mapDataStore.switchToGameLayer()
              }
            }"
          />
          <ImageToggleButton
            class="option"
            :srcSet="icons.map.realisticLayer"
            :value="backgroundLayer === 'realisticLayer'"
            @change="(value: boolean) => {
              if (value) {
                mapDataStore.switchToRealisticLayer()
              }
            }"
          />
        </div>
        <div class="layer-buttons">
          <ToggleButton
            no-caps
            :value="detailLayers.spawn.value.show"
            @change="mapDataStore.toggleDetailLayer('spawn')"
            >{{ t("Spawn Locations") }}</ToggleButton
          >
          <ToggleButton
            no-caps
            :value="detailLayers.worldBorder.value.show"
            @change="mapDataStore.toggleDetailLayer('worldBorder')"
            >{{ t("World Border") }}</ToggleButton
          >
          <ToggleButton
            no-caps
            :value="detailLayers.sporeFlowers.value.show"
            @change="mapDataStore.toggleDetailLayer('sporeFlowers')"
            >{{ t("Spore Flowers") }}</ToggleButton
          >
          <ToggleButton
            no-caps
            :value="detailLayers.pillars.value.show"
            @change="mapDataStore.toggleDetailLayer('pillars')"
            >{{ t("Gas Pillars") }}</ToggleButton
          >
          <ToggleButton
            no-caps
            :value="detailLayers.smallRocks.value.show"
            @change="mapDataStore.toggleDetailLayer('smallRocks')"
            >{{ t("Small Rocks") }}</ToggleButton
          >
          <ToggleButton
            no-caps
            :value="detailLayers.largeRocks.value.show"
            @change="mapDataStore.toggleDetailLayer('largeRocks')"
            >{{ t("Large Rocks") }}</ToggleButton
          >
          <ToggleButton
            no-caps
            :value="detailLayers.caves.value.show"
            @change="mapDataStore.toggleDetailLayer('caves')"
            >{{ t("Caves") }}</ToggleButton
          >
          <ToggleButton
            no-caps
            :value="detailLayers.roads.value.show"
            @change="mapDataStore.toggleDetailLayer('roads')"
            >{{ t("Roads") }}</ToggleButton
          >
        </div>
      </q-tab-panel>

      <q-tab-panel name="nodes" class="node-layers">
        <div
          v-for="[resource, resourceNodeLayer] in Object.entries(resourceNodeLayers)"
          :key="resource"
          class="resource"
        >
          <div class="label">
            <span>{{ t(`resources.${resource}.name`) }}</span>
          </div>
          <div
            v-for="[purity, { show, iconSrcSet }] in Object.entries(resourceNodeLayer.value)"
            :key="purity"
          >
            <ImageToggleButton
              :class="purity"
              :srcSet="iconSrcSet"
              :value="show"
              @change="mapDataStore.toggleResourceNodeLayer(resource, purity)"
            />
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="wells" class="well-layers">
        <div
          v-for="[resource, resourceWellLayer] in Object.entries(resourceWellLayers)"
          :key="resource"
          class="resource"
        >
          <div class="label">
            <span>{{ t(`resources.${resource}.name`) }}</span>
          </div>
          <div
            v-for="[purity, { show, iconSrcSet }] in Object.entries(resourceWellLayer.value)"
            :key="purity"
          >
            <ImageToggleButton
              :class="purity"
              :srcSet="iconSrcSet"
              :value="show"
              @change="mapDataStore.toggleResourceWellLayer(resource, purity)"
            />
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-card-section>
</template>

<style scoped lang="scss">
.q-tabs {
  align-items: center;

  .q-tab {
    padding: 0;
  }
}

.q-tab-panel {
  padding: 0;
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
}

.background-layer-options {
  display: flex;
  justify-content: space-evenly;

  .option {
    width: 10rem;
    max-width: 40%;
    aspect-ratio: 1;
  }
}

.details-layers {
  > *:not(:last-child) {
    margin-bottom: 1rem;
  }

  .layer-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.25rem;

    > .q-btn--push {
      padding: 0.5rem 0.25rem;
    }
  }
}

.node-layers,
.well-layers {
  display: grid;
  grid-template-columns: 1fr repeat(3, min-content);
  gap: 0.25rem;
  align-items: center;

  $button-size: 3.25rem;

  .resource {
    display: contents;

    .label {
      height: $button-size;
      display: flex;
      align-items: center;
    }
  }

  .image-toggle-button {
    aspect-ratio: 1;
    width: $button-size;
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
}
</style>
