<script setup lang="ts">
import { icons } from "~/raw/img";
import { useMapDataStore } from "~/stores/map-data";

const { t } = useI18n();
const tab = ref("layers");

const mapDataStore = useMapDataStore();

const backgroundLayer = toRef(mapDataStore, "backgroundLayer");
const detailLayers = toRefs(mapDataStore.detailLayers);
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
      <q-tab name="layers" :label="t('Map layers')" />
      <q-tab name="nodes" :label="t('Resource Nodes')" />
      <q-tab name="wells" :label="t('Resource Wells')" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="layers" class="layers-panel">
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
            :value="detailLayers.spawn.value"
            @change="mapDataStore.toggleDetailLayer('spawn')"
            >{{ t("Spawn Locations") }}</ToggleButton
          >
          <ToggleButton
            no-caps
            :value="detailLayers.worldBorder.value"
            @change="mapDataStore.toggleDetailLayer('worldBorder')"
            >{{ t("World Border") }}</ToggleButton
          >
          <ToggleButton
            no-caps
            :value="detailLayers.sporeFlowers.value"
            @change="mapDataStore.toggleDetailLayer('sporeFlowers')"
            >{{ t("Spore Flowers") }}</ToggleButton
          >
          <ToggleButton
            no-caps
            :value="detailLayers.pillars.value"
            @change="mapDataStore.toggleDetailLayer('pillars')"
            >{{ t("Gas Pillars") }}</ToggleButton
          >
          <ToggleButton
            no-caps
            :value="detailLayers.smallRocks.value"
            @change="mapDataStore.toggleDetailLayer('smallRocks')"
            >{{ t("Small Rocks") }}</ToggleButton
          >
          <ToggleButton
            no-caps
            :value="detailLayers.largeRocks.value"
            @change="mapDataStore.toggleDetailLayer('largeRocks')"
            >{{ t("Large Rocks") }}</ToggleButton
          >
          <ToggleButton
            no-caps
            :value="detailLayers.caves.value"
            @change="mapDataStore.toggleDetailLayer('caves')"
            >{{ t("Caves") }}</ToggleButton
          >
          <ToggleButton
            no-caps
            :value="detailLayers.roads.value"
            @change="mapDataStore.toggleDetailLayer('roads')"
            >{{ t("Roads") }}</ToggleButton
          >
        </div>
      </q-tab-panel>

      <q-tab-panel name="nodes">
        <div class="text-h6">Alarms</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>

      <q-tab-panel name="wells">
        <div class="text-h6">Movies</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
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

  > * {
    margin-top: 1rem;
  }
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

.layer-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.25rem;

  > .q-btn--push {
    padding: 0.5rem 0.25rem;
  }
}
</style>
