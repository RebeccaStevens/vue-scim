<script setup lang="ts">
import { useMq } from "vue3-mq";

const drawerRight = ref(true);
const miniState = ref(false);

const mq = useMq();
</script>

<template>
  <div class="page-map">
    <q-drawer
      v-model="drawerRight"
      side="right"
      :mini="miniState"
      :width="480"
      :mini-width="mq.mdPlus ? 8 : 0"
      :breakpoint="0"
      behavior="desktop"
      no-swipe-close
      no-swipe-backdrop
      no-swipe-open
      mini-to-overlay
      show-if-above
    >
      <template v-slot:mini>
        <div class="fit control-drawer-mini"></div>

        <div :class="{ 'q-mini-drawer-only': true, 'drawer-state-expand': true, dense: mq.mdPlus }">
          <q-btn
            :dense="mq.mdPlus"
            round
            unelevated
            color="accent"
            icon="i-carbon-chevron-left"
            @click="miniState = false"
          />
        </div>
      </template>

      <q-scroll-area class="fit">
        <Controls class="controls" />
      </q-scroll-area>

      <div :class="{ 'q-mini-drawer-hide': true, 'drawer-state-collapse': true, dense: mq.mdPlus }">
        <q-btn
          :dense="mq.mdPlus"
          round
          unelevated
          color="accent"
          icon="i-carbon-chevron-right"
          @click="miniState = true"
        />
      </div>
    </q-drawer>

    <q-page-container :class="{ 'drawer-right-mini': miniState, 'small-screen': !mq.mdPlus }">
      <q-page>
        <GameMap class="game-map" />
      </q-page>
    </q-page-container>
  </div>
</template>

<style scoped lang="scss">
@use "sass:math";

$spacing: 1.5rem;

$controlsWidth: 25%;
$controlsMinWidth: 28rem;
$controlsMaxWidth: 32rem;

$toolbarHeight: 50px;

.page-map {
  position: relative;
}

.game-map {
  margin: 0;
  position: absolute;
  inset: $spacing math.div($spacing, 2) $spacing $spacing;
}

.controls {
  margin: $spacing $spacing $spacing math.div($spacing, 2);

  > :deep(*) {
    // pointer-events: all;
  }
}

.control-drawer-mini {
  background-color: darkgray;
}

.drawer-state-expand,
.drawer-state-collapse {
  // pointer-events: all;
  position: absolute;
  top: calc(50% - 1.2em);

  &.dense {
    top: calc(50% - 1.5em);
  }
}

.drawer-state-expand {
  left: -2rem;

  &.dense {
    left: -1rem;
  }
}

.drawer-state-collapse {
  left: -1rem;
  &.dense {
    left: -2rem;
  }
}

.q-drawer-container :deep(.q-drawer) {
  background-color: transparent;
  // pointer-events: none;

  &:not(.q-drawer--mini) {
    width: $controlsWidth !important;
    min-width: $controlsMinWidth;
    max-width: $controlsMaxWidth;
  }
}

.q-page-container {
  &.small-screen {
    padding-right: 0 !important;

    .game-map {
      inset: 0;
    }
  }

  &:not(.small-screen) {
    &.drawer-right-mini {
      .game-map {
        inset: $spacing;
      }
    }

    &:not(.drawer-right-mini) {
      padding-right: clamp($controlsMinWidth, $controlsWidth, $controlsMaxWidth) !important;
    }
  }
}
</style>

<route lang="yaml">
meta:
  layout: default
</route>
