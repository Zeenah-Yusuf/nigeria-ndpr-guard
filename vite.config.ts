import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "./",
  
  server: {
    host: "::",
    port: 5173,
    open: true,
    // Proxy Supabase requests in development (optional)
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
      "@components": path.resolve(__dirname, "./src/components"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@data": path.resolve(__dirname, "./src/data"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@contexts": path.resolve(__dirname, "./src/contexts"),
      "@translations": path.resolve(__dirname, "./src/translations"),
    },
  },
  
  build: {
    sourcemap: true,
    // Optimize chunk size
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-accordion', '@radix-ui/react-dropdown-menu', '@radix-ui/react-toast', '@radix-ui/react-tooltip'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'pdf-vendor': ['jspdf', 'jspdf-autotable'],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  
  // Define global constants
  define: {
    __APP_NAME__: JSON.stringify('RegTrack'),
    __APP_VERSION__: JSON.stringify('2.0.0'),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
});