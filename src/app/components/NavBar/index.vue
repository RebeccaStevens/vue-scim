<script setup lang="ts">
import { isDark, useLanguages } from "~/app/composables";

import { useMainMenu } from "./main-menu";

const { t } = useI18n();
const { setLanguage, languageMeta, currentLanguageMeta } = useLanguages();

const menu = useMainMenu();
</script>

<template>
  <q-toolbar>
    <q-toolbar-title flex>
      <template v-for="(menuItem, menuIndex) in menu" :key="menuIndex">
        <q-btn
          v-if="menuItem.type === 'link'"
          :to="menuItem.link"
          flat
          :label="menuItem.label"
          class="menu-item"
        ></q-btn>

        <q-btn-dropdown
          v-else
          :label="menuItem.label"
          flat
          dropdown-icon="i-ic-baseline-arrow-drop-down"
          class="menu-item"
        >
          <q-list>
            <div v-for="(submenuItem, submenuIndex) in menuItem.submenu" :key="submenuIndex">
              <q-separator v-if="submenuItem.type === 'divider'"></q-separator>
              <q-item
                v-else-if="submenuItem.type === 'link'"
                clickable
                v-close-popup
                :to="submenuItem.link"
              >
                <q-item-section>{{ submenuItem.label }}</q-item-section>
              </q-item>
            </div>
          </q-list>
        </q-btn-dropdown>
      </template>

      <q-space></q-space>

      <q-btn-dropdown
        flat
        class="menu-item q-btn-icon"
        :icon="currentLanguageMeta.icon"
        dropdown-icon="i-ic-baseline-arrow-drop-down"
      >
        <q-list>
          <q-item
            v-for="language in languageMeta.values()"
            :key="language.locale"
            clickable
            v-close-popup
            @click="setLanguage(language.locale)"
          >
            <q-item-section avatar>
              <q-icon :name="language.icon"></q-icon>
            </q-item-section>
            <q-item-section>{{ language.name }}</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

      <q-btn-dropdown
        flat
        class="menu-item q-btn-icon"
        dropdown-icon="i-ic-baseline-arrow-drop-down"
        icon="i-carbon-user-avatar-filled"
      >
        <div class="row no-wrap q-pa-md">
          <div class="column">
            <div class="text-h6 q-mb-md">Settings</div>
            <q-toggle
              size="xl"
              class="dark-mode-switch"
              v-model="isDark"
              unchecked-icon="i-emojione-sun"
              checked-icon="i-emojione-crescent-moon"
              color="primary"
              keep-color
              :label="t('Dark Mode')"
            ></q-toggle>
          </div>

          <q-separator vertical inset class="q-mx-lg" />

          <div class="column items-center">
            <q-avatar size="72px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>

            <div class="text-subtitle1 q-mt-md q-mb-xs">John Doe</div>

            <q-btn color="primary" label="Logout" push size="sm" v-close-popup />
          </div>
        </div>
      </q-btn-dropdown>
    </q-toolbar-title>
  </q-toolbar>
</template>

<style scoped>
.menu-item.q-btn-icon {
  margin: 0 0.125rem;
}
</style>
