<script setup lang="ts">
import { storeToRefs } from "pinia";

import * as icons from "~/raw/img/icons";
import { useMapDataStore } from "~/stores/map-data";

const { t } = useI18n();
const activeTab = ref("details");

const mapDataStore = useMapDataStore();
const mapData = storeToRefs(mapDataStore);
</script>

<template>
  <q-card-section>
    <q-tabs
      v-model="activeTab"
      align="justify"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      narrow-indicator
      left-icon="i-carbon-arrow-left"
      right-icon="i-carbon-arrow-right"
    >
      <q-tab
        name="details"
        :label="t('pages.interactive-map.controls.static-elements.detail.label')"
      />
      <q-tab name="nodes" :label="t('pages.interactive-map.controls.static-elements.node.label')" />
      <q-tab name="wells" :label="t('pages.interactive-map.controls.static-elements.well.label')" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="activeTab" animated>
      <q-tab-panel name="details" class="details-layers">
        <div class="background-layer-options">
          <ImageToggleButton
            class="option"
            :srcset="icons.map.gameLayer"
            :value="mapData.backgroundLayer.value === 'gameLayer'"
            :title="t('pages.interactive-map.controls.static-elements.map.in-game.set.title')"
            @change="(value: boolean) => {
              if (value) {
                mapDataStore.setMapVersion(mapDataStore.mapVersion, 'gameLayer')
              }
            }"
          />
          <ImageToggleButton
            class="option"
            :srcset="icons.map.realisticLayer"
            :value="mapData.backgroundLayer.value === 'realisticLayer'"
            :title="t('pages.interactive-map.controls.static-elements.map.realistic.set.title')"
            @change="(value: boolean) => {
              if (value) {
                mapDataStore.setMapVersion(mapDataStore.mapVersion, 'realisticLayer')
              }
            }"
          />
        </div>
        <div class="layer-buttons">
          <ToggleButton
            v-for="detailLayer in Object.values(mapData.detailLayers.value)"
            :key="detailLayer.id"
            class="detail"
            :value="detailLayer.show"
            :count="detailLayer.markerCount"
            :title="
              t(
                'pages.interactive-map.controls.static-elements.detail.toggle.layer.title',
                {
                  detail: `pages.interactive-map.controls.static-elements.detail.buttons.${detailLayer.name}.label`,
                },
                detailLayer.markerCount ?? 1
              )
            "
            @change="mapDataStore.toggleLayerVisibility(detailLayer.id)"
            >{{
              t(
                `pages.interactive-map.controls.static-elements.detail.buttons.${detailLayer.name}.label`,
                detailLayer.markerCount ?? 1
              )
            }}</ToggleButton
          >
        </div>
      </q-tab-panel>

      <q-tab-panel name="nodes" class="node-layers">
        <ResourceButtons
          v-for="[resource, resourceLayerData] in Object.entries(mapData.resourceNodeLayers.value)"
          :key="resource"
          :resource="resource"
          type="node"
          :resourceLayerData="resourceLayerData"
        />
      </q-tab-panel>

      <q-tab-panel name="wells" class="well-layers">
        <ResourceButtons
          v-for="[resource, resourceLayerData] in Object.entries(mapData.resourceWellLayers.value)"
          :key="resource"
          :resource="resource"
          type="well"
          :resourceLayerData="resourceLayerData"
        />
      </q-tab-panel>
    </q-tab-panels>
  </q-card-section>
</template>

<style scoped lang="scss">
.q-tab {
  flex: 1 1 auto;
  padding: 0;
}

.q-tab-panels {
  margin-top: 1rem;
}

.q-tab-panel {
  padding: 0;
  display: flex;
  flex-direction: column;
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

    .detail {
      padding: 0.5rem 0.25rem;
      --badge-width: 4ch;
    }
  }
}
</style>
