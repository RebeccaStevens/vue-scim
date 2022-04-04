import { Dark as QuasarDark } from "quasar";

// these APIs are auto-imported from @vueuse/core
export const isDark = useDark();
export const toggleDark = useToggle(isDark);

QuasarDark.set(isDark.value);

watch(isDark, (newValue) => {
  QuasarDark.set(newValue);
});
