import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  shortcuts: [
    {
      "icon-btn":
        "p-2 aspect-square cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100",
      "absolute-fill":
        "p-2 aspect-square cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100",
    },
  ],
  presets: [
    presetUno(),
    presetAttributify({
      strict: true,
    }),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: "DM Sans",
        serif: "DM Serif Display",
        mono: "DM Mono",
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  safelist: [
    "i-carbon-download",
    "i-carbon-upload",
    "i-carbon-user-avatar-filled",
    "i-emojione-crescent-moon",
    "i-emojione-flag-for-united-states",
    "i-emojione-sun",
    "i-ic-baseline-arrow-drop-down",
  ],
});
