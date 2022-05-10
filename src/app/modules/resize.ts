import VueResize from "vue-resize";
import "vue-resize/dist/vue-resize.css";

import type { UserModule } from "~/module-types";

export const install: UserModule = ({ app }) => {
  app.use(VueResize);
};
