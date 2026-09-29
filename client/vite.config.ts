import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import legacy from '@vitejs/plugin-legacy'
import path from 'path'

export default defineConfig({
    plugins: [
        react(),
        legacy({
            targets: ['chrome >= 62', 'android >= 8'],
        })
    ],
    build: {
        target: ['es2015', 'chrome62']
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@workspaceModules': path.resolve(__dirname, './src/modules/workspace/modules'),
            '@modules': path.resolve(__dirname, './src/modules'),
            '@config': path.resolve(__dirname, './src/config'),
            '@shared': path.resolve(__dirname, './src/shared'),
            '@stores': path.resolve(__dirname, './src/stores'),
        },
    },
    server: {
        port: parseInt(process.env.VITE_PORT || '3001'),
        host: '0.0.0.0',
        allowedHosts: true,
        hmr: process.env.VITE_HMR_HOST && process.env.VITE_HMR_HOST.trim() ? {
            protocol: 'wss',
            host: process.env.VITE_HMR_HOST,
            port: parseInt(process.env.VITE_PORT || '3001')
        } : false,
        proxy: {
            '/ws': {
                target: 'http://server:3000',
                ws: true,
                changeOrigin: true,
            },
            '/api': {
                target: 'http://server:3000',
                changeOrigin: true,
            }
        }
    }
})
