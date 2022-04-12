<script setup lang="ts">
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
        imgSrc: "img/gameUpdate5/IconDesc_FicsitFoundation4m.png",
        children: [
          {
            title: "Foundation 1m",
            imgSrc: "img/gameUpdate5/IconDesc_FicsitFoundation1m.png",
          },
          {
            title: "Foundation 2m",
            imgSrc: "img/gameUpdate5/IconDesc_FicsitFoundation2m.png",
          },
          {
            title: "Foundation 4m",
            imgSrc: "img/gameUpdate5/IconDesc_FicsitFoundation4m.png",
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

<style scoped>
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
