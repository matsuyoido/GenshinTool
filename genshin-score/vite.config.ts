import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import Pages from 'vite-plugin-pages';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), Pages()],
  base: "/GenshinTool/", // https://ja.vitejs.dev/guide/static-deploy.html#github-pages
  build: {
    outDir: "../docs",
    emptyOutDir: true,
    target: ['es2022', 'edge89', 'firefox89', 'chrome89', 'safari15'],
    assetsInlineLimit: 0,
    rollupOptions: {
      external: ["react", "react-router", "react-router-dom"],
      input: {
        main: 'index.html',
        404: '404.html',
      }
    },
  },
  server: {
    watch: {
      usePolling: true,
    }
  }
});
