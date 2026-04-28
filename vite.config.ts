import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: "./",
  
  server: {
    host: "::",
    port: 5173,
    open: true,
    proxy: {
      '/functions/v1': {
        target: process.env.VITE_SUPABASE_URL || 'http://localhost:54321',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  
  plugins: [react()],
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') || 
              id.includes('node_modules/react-router-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/@radix-ui')) {
            return 'ui-vendor';
          }
          if (id.includes('node_modules/@supabase')) {
            return 'supabase-vendor';
          }
          if (id.includes('node_modules/jspdf') || 
              id.includes('node_modules/jspdf-autotable')) {
            return 'pdf-vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  
  define: {
    __APP_NAME__: JSON.stringify('RegTrack'),
    __APP_VERSION__: JSON.stringify('2.0.0'),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
});