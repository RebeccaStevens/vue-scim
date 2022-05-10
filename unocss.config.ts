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
  rules: [
    [
      "display-none",
      {
        display: "none !important",
      },
    ],
  ],
  presets: [
    presetUno(),
    presetAttributify({
      strict: true,
    }),
    presetIcons({
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
    "i-carbon-analytics",
    "i-carbon-download",
    "i-carbon-upload",
    "i-carbon-user-avatar-filled",
    "i-carbon-arrow-left",
    "i-carbon-arrow-right",
    "i-carbon-chevron-left",
    "i-carbon-chevron-right",
    "i-clarity-flask-solid",
    "i-emojione-crescent-moon",
    "i-emojione-flag-for-united-states",
    "i-emojione-flag-for-united-kingdom",
    "i-emojione-sun",
    "i-ic-baseline-arrow-drop-down",
    "i-ic-play-arrow",
    "i-fa6-solid-gears",
  ],
});
