import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâ€”file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
            'editor-vendor': ['@tiptap/react', '@tiptap/starter-kit', '@tiptap/extension-color', '@tiptap/extension-highlight', '@tiptap/extension-image', '@tiptap/extension-link', '@tiptap/extension-table', '@tiptap/extension-table-cell', '@tiptap/extension-table-header', '@tiptap/extension-table-row', '@tiptap/extension-text-align', '@tiptap/extension-text-style', '@tiptap/extension-underline'],
            'pdf-excel-vendor': ['jspdf', 'jspdf-autotable', 'xlsx', 'html2canvas'],
            'ui-vendor': ['lucide-react', 'motion', 'date-fns']
          }
        }
      },
      chunkSizeWarningLimit: 1000
    }
  };
});
