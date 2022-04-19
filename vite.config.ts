import type { Dirent } from "node:fs";
import { promises as fs } from "node:fs";
import path from "node:path";
import url from "node:url";

import ImportMetaEnvPlugin from "@import-meta-env/unplugin";
import VueI18n from "@intlify/vite-plugin-vue-i18n";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import Vue from "@vitejs/plugin-vue";
import type { TransformFactory } from "imagetools-core";
import * as imagetools from "imagetools-core";
import { pipe, page, map } from "iter-ops";
import LinkAttributes from "markdown-it-link-attributes";
import Prism from "markdown-it-prism";
import type { FormatEnum } from "sharp";
import sharp from "sharp";
import Unocss from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import { QuasarResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { defineConfig } from "vite";
import { imagetools as imagetoolsPlugin } from "vite-imagetools";
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
  process.env.NODE_ENV = mode;

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

      imagetoolsPlugin(),

      autoImageIndex(),

      // generateMapImages(),

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

function getImageFormats(): Array<keyof FormatEnum> {
  // return process.env.NODE_ENV === "production" ? ["png", "webp"] : ["webp"];
  return ["webp"];
}

function autoImageIndex() {
  const imageFormats = getImageFormats();

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const getIndexContent = (dirContent: Dirent[], relRoot: string) => {
    const content = dirContent
      .map((dirent) => {
        if (dirent.isDirectory()) {
          return `export * as ${dirent.name} from "./${dirent.name}";\n`;
        }
        if (dirent.isFile()) {
          const { name, ext } = path.parse(dirent.name);

          if (ext === ".ts") {
            return undefined;
          }

          const dims = [32, 64, 128, 256];

          const importsData = imageFormats.flatMap((format) =>
            dims.map((size) => {
              const queryString = `${new URLSearchParams({
                format,
                width: String(size),
              })
                .toString()
                .replaceAll("=&", "&")}&imagetools`;

              return {
                fullName: `${name}_${format}_${size}`,
                relPath: `./${dirent.name}?${queryString}`,
                format,
                size,
              };
            })
          );

          const imports = importsData.map(
            ({ fullName, relPath }) => `import ${fullName} from "${relPath}";\n`
          );

          const exports = `export const ${name} = createSrcSet([${importsData
            .map(
              ({ fullName, size, format }) =>
                `{ src: ${fullName}, size: ${size}, format: "${format}" }`
            )
            .join(", ")}]);\n`;

          return `${imports.join("")}${exports}`;
        }
        return undefined;
      })
      .filter(<T>(i: T | undefined): i is T => i !== undefined);

    return `/// <reference types="${relRoot}/types" />\nimport { createSrcSet } from "~/utils";\n\n${content.join(
      "\n"
    )}`;
  };

  const createForSubDir = async (dir: string, relRoot: string) => {
    const dirContent = await fs.readdir(dir, {
      withFileTypes: true,
    });

    const subDirs = dirContent
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    const indexContent = getIndexContent(dirContent, relRoot);

    const indexPath = path.join(dir, "index.ts");
    await fs.writeFile(indexPath, indexContent, { encoding: "utf8" });
    await Promise.all(
      subDirs.map((subDir) =>
        createForSubDir(path.join(dir, subDir), `${relRoot}/..`)
      )
    );
  };

  const createForDir = async (dir: string, relRoot: string) => {
    const dirContent = await fs.readdir(dir, {
      withFileTypes: true,
    });

    const subDirs = dirContent
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    const indexContent = `${subDirs
      .map((name) => `import * as ${name} from "./${name}";\n`)
      .filter(<T>(i: T | undefined): i is T => i !== undefined)
      .join("\n")}\n\nconst icons = new Map<string, string>();\n${subDirs
      .map(
        (name) =>
          `for (const [name, icon] of Object.entries(${name})) {\n  icons.set(name, icon)\n}`
      )
      .join("\n")}\nexport default icons;\nexport { ${subDirs.join(", ")} }\n`;

    const indexPath = path.join(dir, "index.ts");
    await fs.writeFile(indexPath, indexContent, { encoding: "utf8" });
    await Promise.all(
      subDirs.map((subDir) =>
        createForSubDir(path.join(dir, subDir), `${relRoot}/..`)
      )
    );
  };

  return {
    name: "auto-image-index",

    async buildStart() {
      await createForDir(path.resolve(dirname, "src/app/raw/img/icons"), "..");
    },
  };
}

function generateMapImages() {
  const baseSize = 1024;
  const tileSize = 256;
  const zoomLevels = 8;
  const batchSize = 10_000;

  return {
    name: "generate-map-images",

    async buildStart() {
      console.log("preparing map images...");
      const imageFile = path.resolve(
        dirname,
        "src/app/raw/img/map/EarlyAccess/gameLayer.png"
      );

      const { dir: imageFileDir, name: imageFileName } = path.parse(imageFile);
      const baseOutputDir = path.resolve(
        dirname,
        "src/public/",
        path.relative(path.join(dirname, "src/app/raw"), imageFileDir),
        imageFileName
      );

      const imageFormats = getImageFormats();
      let m_imagesSaved = 0;

      const sharpImage = sharp(imageFileName);

      console.log("creating map images...");
      const processes = await Promise.all(
        Array.from({ length: zoomLevels }).flatMap((_, zoomLevel) => {
          const scale = 2 ** zoomLevel;
          const size = baseSize * scale;
          const tiles = Array.from({ length: (baseSize * scale) / tileSize });

          return tiles.flatMap((_, ix) => {
            const outpurDir = path.join(
              baseOutputDir,
              `${zoomLevel + 1}`,
              `${ix}`
            );
            const left = ix * tileSize;

            return tiles.flatMap((_, iy) => {
              const top = iy * tileSize;

              return imageFormats.map((format) => {
                const outputFile = path.join(outpurDir, `${iy}.${format}`);

                return [
                  outputFile,
                  async () => {
                    await fs.mkdir(outpurDir, {
                      recursive: true,
                    });

                    return sharpImage
                      .clone()
                      .resize({ width: size, height: size })
                      .extract({
                        left,
                        top,
                        width: tileSize,
                        height: tileSize,
                      })
                      .toFormat(format)
                      .toFile(outputFile);
                  },
                ] as const;
              });
            });
          });
        })
      );

      const isProd = process.env.NODE_ENV === "production";
      console.log(
        "total map images:",
        Intl.NumberFormat().format(processes.length)
      );

      const batches = pipe(
        processes,
        page(batchSize),
        map(
          (batch) => () =>
            Promise.all(
              batch.map(async ([outputFile, generate]) => {
                if (!isProd) {
                  try {
                    // Check if output file doesn't already exists.
                    await fs.access(outputFile);
                    return;
                  } catch {}
                }

                await generate();
              })
            )
        )
      );

      for (const runBatch of batches) {
        // eslint-disable-next-line no-await-in-loop -- Wait for current batch to finish before starting the next.
        await runBatch();

        m_imagesSaved += batchSize;
        const percentage = (100 * m_imagesSaved) / processes.length;
        console.log(`${percentage.toFixed(1)}%`);
      }
    },
  };
}
