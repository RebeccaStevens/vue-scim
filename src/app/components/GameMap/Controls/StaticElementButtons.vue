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
    >
      <q-tab
        name="details"
        :label="t('pages.interactive-map.controls.static-elements.detail.label')"
      />
      <q-tab name="nodes" :label="t('pages.interactive-map.controls.static-elements.node.label')" />
      <q-tab name="wells" :label="t('pages.interactive-map.controls.static-elements.well.label')" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="details" class="details-layers">
        <div class="background-layer-options">
          <ImageToggleButton
            class="option"
            :srcset="icons.map.gameLayer"
            :value="backgroundLayer === 'gameLayer'"
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
            :value="backgroundLayer === 'realisticLayer'"
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
            v-for="[detail, detailLayer] in Object.entries(detailLayers)"
            :key="detail"
            class="detail"
            :value="detailLayer.value.show"
            :title="
              t(
                'pages.interactive-map.controls.static-elements.detail.toggle.layer.title',
                {
                  detail: `pages.interactive-map.controls.static-elements.detail.buttons.${detail}.label`,
                },
                /* TODO: count */ 2
              )
            "
            @change="mapDataStore.toggleDetailLayer(detail)"
            >{{
              t(
                `pages.interactive-map.controls.static-elements.detail.buttons.${detail}.label`,
                /* TODO: count */ 2
              )
            }}</ToggleButton
          >
        </div>
      </q-tab-panel>

      <q-tab-panel name="nodes" class="node-layers">
        <ResourceButtons
          v-for="[resource, resourceLayerData] in Object.entries(resourceNodeLayers)"
          :key="resource"
          :resource="resource"
          type="node"
          :resourceLayerData="resourceLayerData.value"
        />
      </q-tab-panel>

      <q-tab-panel name="wells" class="well-layers">
        <ResourceButtons
          v-for="[resource, resourceLayerData] in Object.entries(resourceWellLayers)"
          :key="resource"
          :resource="resource"
          type="well"
          :resourceLayerData="resourceLayerData.value"
        />
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

    .detail {
      padding: 0.5rem 0.25rem;
    }
  }
}
</style>
