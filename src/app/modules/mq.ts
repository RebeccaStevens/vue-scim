import { Vue3Mq } from "vue3-mq";

import type { UserModule } from "~/module-types";

export const install: UserModule = ({ app }) => {
  app.use(Vue3Mq, {
    // quasar breakpoints
    breakpoints: {
      xs: 0,
      sm: 600,
      md: 1024,
      lg: 1440,
      xl: 1920,
    },
    defaultBreakpoint: "xl",
    defaultOrientation: "landscape",
    defaultTheme: "light",
    defaultMotion: "no-preference",
  });
};
