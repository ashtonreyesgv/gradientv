// the door Vercel uses to reach the server.
// Vercel turns every file in /api into a function, and vercel.json sends every
// /api/... request to this one. so it's the same Express app i run on my laptop,
// just started by Vercel instead of by server/src/server.js
import { createApp } from '../server/src/app.js';

export default createApp();
