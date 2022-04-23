<script setup lang="ts">
type Node = {
  imgSrc?: string;
  imgSrcSet?: string;
  title?: string;
  children?: ReadonlyArray<Node>;
};

defineProps<{
  node: Node;
}>();

const largeMenuSize = 25;
</script>

<template>
  <QMenuHover class="image-toggle-button-menu">
    <template #default="{ activatorAttr, menuAttr }">
      <ImageToggleButton
        :src="node.imgSrc"
        :srcSet="node.imgSrcSet"
        :title="node.title"
        v-bind="activatorAttr"
      >
        <q-menu
          v-if="(node?.children?.length ?? 0) > 0"
          v-bind="menuAttr"
          anchor="bottom middle"
          self="top middle"
        >
          <div :class="{ menu: true, large: (node.children?.length ?? 0) >= largeMenuSize }">
            <ImageToggleButtonMenu
              v-for="(child, index) in node.children"
              :key="index"
              :node="child"
              class="item"
            />
          </div>
        </q-menu>
      </ImageToggleButton>
    </template>
  </QMenuHover>
</template>

<style scoped>
.menu {
  display: grid;
  grid-template-columns: repeat(6, max-content);
}
.menu.large {
  grid-template-columns: repeat(8, max-content);
}
.item {
}
</style>
