import { defineConfig } from "vite";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";

/**
 * Emit games.json into the build output. The manifest is the single source of
 * truth at the repo root (backend scripts read it from there), and the game +
 * studio fetch it at runtime via /games.json — so a static deploy must include
 * it. This copies it at build time instead of duplicating the file in public/.
 */
function emitManifest() {
  return {
    name: "emit-games-manifest",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "games.json",
        source: readFileSync(resolve(__dirname, "games.json"), "utf8"),
      });
    },
  };
}

export default defineConfig({
  root: ".",
  plugins: [emitManifest()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      // The Studio's "Run Playtest" button calls this; the studio server
      // (scripts/studio-server.mjs) runs Kane and returns results.
      "/api": "http://localhost:8787",
    },
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      input: {
        studio: resolve(__dirname, "index.html"),
        play: resolve(__dirname, "play.html"),
      },
    },
  },
});
