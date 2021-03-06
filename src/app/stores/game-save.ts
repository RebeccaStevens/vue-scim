import { acceptHMRUpdate, defineStore } from "pinia";

export const useGameSaveStore = defineStore("game-save", () => {
  const hasGameSave = ref(true);

  return {
    hasGameSave,
  };
});

if (typeof import.meta.hot === "object") {
  import.meta.hot.accept(acceptHMRUpdate(useGameSaveStore, import.meta.hot));
}
