// vite runs the React app while developing and builds it for Vercel.
// it turns the JSX + Tailwind into plain files the browser can read
//
// the proxy: the browser only talks to port 5173. anything starting with /api
// gets passed along to Express on port 4000, same as the dashboard.
//  why: so the client can just fetch '/api/health' without the whole server address,
//  and the browser doesn't block it for being on a different port (CORS).
//  on Vercel the rewrite in vercel.json does the same job
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const API_URL = process.env.API_URL ?? 'http://localhost:4000';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        port: 5173,
        proxy: { '/api': API_URL }
    },
    preview: {
        port: 5173,
        proxy: { '/api': API_URL }
    }
});
