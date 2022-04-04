import { promises as fs } from "node:fs";
import path from "node:path";
import url from "node:url";

import ImportMetaEnvPlugin from "@import-meta-env/unplugin";
import VueI18n from "@intlify/vite-plugin-vue-i18n";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import Vue from "@vitejs/plugin-vue";
import LinkAttributes from "markdown-it-link-attributes";
import Prism from "markdown-it-prism";
import Unocss from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import { Vuetify3Resolver } from "unplugin-vue-components/resolvers";
import type { ComponentResolver } from "unplugin-vue-components/types";
import Components from "unplugin-vue-components/vite";
import { defineConfig } from "vite";
import Inspect from "vite-plugin-inspect";
import Markdown from "vite-plugin-md";
import Pages from "vite-plugin-pages";
import { VitePWA } from "vite-plugin-pwa";
import Layouts from "vite-plugin-vue-layouts";
import generateSitemap from "vite-ssg-sitemap";
import tsconfigPaths from "vite-tsconfig-paths";

const markdownWrapperClasses = "prose prose-sm m-auto text-left";

const dirname = path.dirname(url.fileURLToPath(import.meta.url));

const nestedComponentResolver: ComponentResolver = async (name: string) => {
  const parts = name.split("_");
  if (parts.length <= 1) {
    return;
  }

  const corePath = `${dirname}/src/app/components/${parts.join("/")}`;

  const coreStat = await fs.stat(corePath).catch(() => undefined);
  if (coreStat?.isDirectory()) {
    return {
      path: `${corePath}/index.vue`,
    };
  }

  return {
    path: `${corePath}.vue`,
  };
};

export default defineConfig(({ command, mode }) => {
  console.log("Command:", command);
  console.log("Mode:   ", mode);

  return {
    root: "src",

    build: {
      outDir: path.resolve(dirname, "dist"),
      emptyOutDir: true,
      // ssr: true,
      target: mode === "production" ? "es2018" : "esnext",
      rollupOptions: {
        output: {
          inlineDynamicImports: false,
        },
      },
    },

    plugins: [
      tsconfigPaths({
        projects: [path.resolve(dirname, "tsconfig.json")],
        loose: true,
      }),

      ImportMetaEnvPlugin.vite({
        env: ".env",
        example: ".env.example",
      }),

      Vue({
        include: [/\.vue$/u, /\.md$/u],
        reactivityTransform: true,
        template: { transformAssetUrls },
      }),

      quasar({
        sassVariables: "src/app/styles/quasar-variables.sass",
      }),

      // https://github.com/hannoeru/vite-plugin-pages
      Pages({
        dirs: "app/pages",
        extensions: ["vue", "md"],
      }),

      // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
      Layouts({
        layoutsDirs: "app/layouts",
      }),

      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: [
          "vue",
          "vue-router",
          "vue-i18n",
          "vue/macros",
          "@vueuse/head",
          "@vueuse/core",
        ],
        resolvers: [Vuetify3Resolver()],
        dts:
          mode === "test"
            ? "src/app/auto-imports.d.ts"
            : "app/auto-imports.d.ts",
        eslintrc: {
          enabled: true,
          filepath: path.resolve(dirname, ".eslintrc-auto-import.json"),
        },
      }),

      // https://github.com/antfu/unplugin-vue-components
      Components({
        resolvers: [Vuetify3Resolver(), nestedComponentResolver],
        // allow auto load markdown components under `./components/`
        extensions: ["vue", "md"],
        // allow auto import and register components used in markdown
        include: [/\.vue$/u, /\.vue\?vue/u, /\.md$/u],
        dirs: "app/components",
        dts:
          mode === "test" ? "src/app/components.d.ts" : "app/components.d.ts",
      }),

      // https://github.com/antfu/unocss
      // see unocss.config.ts for config
      Unocss({
        configFile: path.resolve(dirname, "unocss.config.ts"),
      }),

      // https://github.com/antfu/vite-plugin-md
      // Don't need this? Try vitesse-lite: https://github.com/antfu/vitesse-lite
      Markdown({
        wrapperClasses: markdownWrapperClasses,
        headEnabled: true,
        markdownItSetup(md) {
          // https://prismjs.com/
          md.use(Prism);
          md.use(LinkAttributes, {
            matcher: (link: string) => /^https?:\/\//u.test(link),
            attrs: {
              target: "_blank",
              rel: "noopener",
            },
          });
        },
      }),

      // https://github.com/antfu/vite-plugin-pwa
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.svg", "safari-pinned-tab.svg"],
        manifest: {
          name: "Vitesse",
          short_name: "Vitesse",
          theme_color: "#ffffff",
          icons: [
            {
              src: "/pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "/pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        },
      }),

      // https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n
      VueI18n({
        runtimeOnly: true,
        compositionOnly: true,
        include: [path.resolve(dirname, "src/locales/**")],
      }),

      // https://github.com/antfu/vite-plugin-inspect
      // Visit http://localhost:3000/__inspect/ to see the inspector
      Inspect(),
    ],

    worker: {
      format: "es",
    },

    // https://github.com/antfu/vite-ssg
    ssgOptions: {
      script: "async",
      entry: "app/main.ts",
      formatting: "minify",
      includedRoutes(paths, routes) {
        return paths.filter((i) => !i.includes("readme"));
      },
      onFinished() {
        generateSitemap();
      },
    },

    // https://github.com/vitest-dev/vitest
    test: {
      dir: path.resolve(dirname, "test"),
      environment: "jsdom",
      deps: {
        inline: ["@vue", "@vueuse", "vue-demi"],
      },
    },
  };
});
