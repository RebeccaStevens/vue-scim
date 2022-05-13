import { Quasar } from "quasar";

import type { UserModule } from "~/module-types";

const darkSetting = localStorage.getItem("preferred-color-scheme");

export const install: UserModule = ({ app }) => {
  app.use(Quasar, {
    config: {
      dark:
        darkSetting === "dark"
          ? true
          : darkSetting === "light"
          ? false
          : "auto",
    },
  });
};
