import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import Pages from 'vite-plugin-pages';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), Pages()],
  base: "", // NOTE: change href,src path relative
  build: {
    outDir: "../docs",
    emptyOutDir: true,
  },
});
