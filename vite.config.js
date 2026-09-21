import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@tinymce') || id.includes('tinymce')) {
              return 'vendor-tinymce';
            }
            if (id.includes('chart.js') || id.includes('recharts') || id.includes('react-chartjs-2')) {
              return 'vendor-charts';
            }
            if (id.includes('jspdf') || id.includes('html2pdf') || id.includes('@react-pdf')) {
              return 'vendor-pdf';
            }
            if (id.includes('@mui/x-data-grid')) {
              return 'vendor-datagrid';
            }
            if (id.includes('@mui') || id.includes('@emotion')) {
              return 'vendor-mui';
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
          }
        },
      },
    },
  },
})
