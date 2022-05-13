import { Dark as QuasarDark } from "quasar";

export const isDark = computed({
  get() {
    return QuasarDark.isActive;
  },
  set(v: boolean) {
    QuasarDark.set(v);
    localStorage.setItem("preferred-color-scheme", v ? "dark" : "light");
  },
});

export const toggleDark = QuasarDark.toggle;

watch(isDark, (value) => {
  document.documentElement.classList.toggle("dark", value);
});
