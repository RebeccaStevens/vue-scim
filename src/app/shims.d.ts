import type { DefineComponent } from "vue";

declare module "*.md" {
  const component: DefineComponent<{}, {}, unknown>;
  export default component;
}

declare module "*.vue" {
  const component: DefineComponent<{}, {}, unknown>;
  export default component;
}
