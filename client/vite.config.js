// vite runs the React app while developing and builds it for Vercel.
// it turns the JSX + Tailwind into plain files the browser can read
//
// there's no server yet, so there's no proxy here. when the Express server
// exists, this is where '/api' gets passed along to it, same as the dashboard:
//
//     const API_URL = process.env.API_URL ?? 'http://localhost:4000';
//     server: { port: 5173, proxy: { '/api': API_URL } }
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        port: 5173
    },
    preview: {
        port: 5173
    }
});
