// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss()
    ],
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
                secure: false
            },
            '/auth': {
                target: 'http://localhost:3001',
                changeOrigin: true,
                secure: false
            },
            '/products': {
                target: 'http://localhost:3001',
                changeOrigin: true,
                secure: false
            },
            '/orders': {
                target: 'http://localhost:3001',
                changeOrigin: true,
                secure: false
            },
            '/chat': {
                target: 'http://localhost:3001',
                changeOrigin: true,
                secure: false
            },
            '/stores': {
                target: 'http://localhost:3001',
                changeOrigin: true,
                secure: false
            }
        },
        headers: {
            'Cache-Control': 'no-store'
        },
        hmr: {
            protocol: 'ws',
            host: 'localhost'
        }
    },
    envDir: './env',
    build: {
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    xhr: ['./src/services/xhr.js']
                }
            }
        }
    }
});
