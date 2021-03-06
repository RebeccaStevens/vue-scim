import { setupLayouts } from "virtual:generated-layouts";
import generatedRoutes from "virtual:generated-pages";
import { ViteSSG } from "vite-ssg";
import "quasar/src/css/index.sass";

import App from "./App.vue";

import "@unocss/reset/tailwind.css";
import "./styles/index.scss";
import "uno.css";

const routes = setupLayouts(generatedRoutes);

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  {
    routes,
    base: import.meta.env.BASE_URL,
  },
  (ctx) => {
    // install all modules under `modules/`
    Object.values(import.meta.globEager("./modules/*.ts")).forEach((i) =>
      i.install?.(ctx)
    );
  }
);
