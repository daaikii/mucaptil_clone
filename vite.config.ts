import { defineConfig } from 'vite'
import glsl from "vite-plugin-glsl"
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    glsl({
      include: "**/*.glsl",
      warnDuplicatedImports: true,
      defaultExtension: 'glsl',
      watch: true,
    }),
  ],
})
