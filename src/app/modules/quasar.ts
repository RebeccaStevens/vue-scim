import { Quasar } from "quasar";

import type { UserModule } from "~/app/module-types";

export const install: UserModule = ({ app }) => {
  app.use(Quasar);
};
