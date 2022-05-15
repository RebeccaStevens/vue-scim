<script setup lang="ts">
import { icons as images } from "~/raw/img";
import { useGameSaveStore } from "~/stores/game-save";

const { t } = useI18n();

const nodes = [
  {
    title: "Player information",
    children: [],
  },
  {
    title: "Structures",
    children: [
      {
        title: "Foundations",
        imgSrcset: images.gameUpdate5.IconDesc_FicsitFoundation4m,
        children: [
          {
            title: "Foundation 1m",
            imgSrcset: images.gameUpdate5.IconDesc_FicsitFoundation1m,
          },
          {
            title: "Foundation 2m",
            imgSrcset: images.gameUpdate5.IconDesc_FicsitFoundation2m,
          },
          {
            title: "Foundation 4m",
            imgSrcset: images.gameUpdate5.IconDesc_FicsitFoundation4m,
          },
        ],
      },
    ],
  },
] as const;
</script>

<template>
  <q-card-section>
    <div v-for="(node, nodeIndex) in nodes" :key="nodeIndex">
      {{ node.title }}
      <div flex>
        <ImageToggleButtonMenu
          v-for="(child, childIndex) in node.children"
          :key="childIndex"
          :node="child"
        ></ImageToggleButtonMenu>
        <ImageToggleButtonMenu
          v-for="(child, childIndex) in node.children"
          :key="childIndex"
          :node="child"
        ></ImageToggleButtonMenu>
      </div>
    </div>
  </q-card-section>
</template>

<style lang="scss" scoped>
.node {
  border-radius: 0.5rem;
  padding: 0.25rem;
  margin: 0.25rem;
  width: 3.5rem;
  aspect-ratio: 1;
}

.node.checked {
  box-shadow: 0 0 0 0.2rem rgb(243 156 18 / 50%);
}
</style>
