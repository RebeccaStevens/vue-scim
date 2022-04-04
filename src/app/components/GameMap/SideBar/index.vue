<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div class="host">
    <GameMap_SideBar_GameSave />

    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">Our Changing Planet</div>
        <div class="text-subtitle2">by John Doe</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<style scoped>
.host {
  display: flex;
  flex-direction: column;
}
</style>
