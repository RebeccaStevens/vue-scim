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
import { QuasarResolver } from "unplugin-vue-components/resolvers";
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

export default defineConfig(({ command, mode }) => {
  console.log("Command:", command);
  console.log("Mode:   ", mode);

  return {
    root: "src",

    // resolve: {
    //   alias: {
    //     vue: "vue/dist/vue.esm-bundler",
    //   },
    // },

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
        script: {
          babelParserPlugins: ["importAssertions"],
        },
      }),

      quasar({
        sassVariables: "src/app/styles/quasar-variables.sass",
      }),

      // https://github.com/hannoeru/vite-plugin-pages
      Pages({
        dirs: "app/pages",
        exclude: ["**/README.md"],
        extensions: ["vue", "md"],
      }),

      // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
      Layouts({
        exclude: ["**/README.md"],
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
        resolvers: [QuasarResolver()],
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
        resolvers: [QuasarResolver()],
        // allow auto load markdown components under `./components/`
        extensions: ["vue", "md"],
        // allow auto import and register components used in markdown
        include: [/\.vue$/u, /\.vue\?vue/u, /\.md$/u],
        dirs: "app/components",
        dts:
          mode === "test"
            ? "src/app/auto-imports-components.d.ts"
            : "app/auto-imports-components.d.ts",
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
        includeAssets: ["img/favicon.icon"],
        manifest: {
          name: "SC",
          short_name: "SC",
          theme_color: "#ffffff",
          icons: [
            {
              src: "img/favicons-16x16.png",
              sizes: "16x16",
              type: "image/png",
            },
            {
              src: "img/favicons-32x32.png",
              sizes: "32x32",
              type: "image/png",
            },
            {
              src: "img/favicons-92x92.png",
              sizes: "92x92",
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
