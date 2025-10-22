import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa' // Importa o plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    
    // Adiciona o bloco de configuração do PWA
    VitePWA({
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff,woff2}'],
      },
      manifest: {
        name: 'Corpo de Bombeiros', // <-- O nome que você queria ver
        short_name: 'Bombeiros',
        description: 'Aplicativo para gerenciamento de ocorrências.',
        theme_color: '#092642',
        background_color: '#FFFFFF',
        start_url: '/',
        display: 'standalone',
        scope: '/',

        // Lista completa de ícones que estão na pasta /public
        icons: [
          { src: 'icon-48x48.png', sizes: '48x48', type: 'image/png' },
          { src: 'icon-72x72.png', sizes: '72x72', type: 'image/png' },
          { src: 'icon-96x96.png', sizes: '96x96', type: 'image/png' },
          { src: 'icon-128x128.png', sizes: '128x128', type: 'image/png' },
          { src: 'icon-144x144.png', sizes: '144x144', type: 'image/png' },
          { src: 'icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-256x256.png', sizes: '256x256', type: 'image/png' },
          { src: 'icon-384x384.png', sizes: '384x384', type: 'image/png' },
          { src: 'icon-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Ícone adaptável
          }
        ],
      },
    }),
  ],
})