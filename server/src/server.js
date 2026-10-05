// starts the server on my laptop: read .env, connect to MongoDB, listen on a port.
// Vercel never runs this file. there is no port to listen on there, it calls the
// app straight from api/index.js and gets its settings from the Vercel dashboard
import dotenv from 'dotenv';
import { createApp } from './app.js';
import { connectDatabase } from './db.js';

// override: .env wins over whatever PORT the terminal already has set. learned
// this the hard way: a tool set PORT=5173 and the API grabbed Vite's port!
dotenv.config({ override: true, quiet: true });

const PORT = Number(process.env.PORT) || 4000;

try {
    await connectDatabase();
    // never print MONGODB_URI itself. the Atlas one has the database password in it
    console.log('Connected to MongoDB');
} catch (error) {
    // keep going anyway. /api/health will say the database is down, which is what it's for
    console.error(`No database: ${error.message}`);
}

createApp().listen(PORT, () => {
    console.log(`GradientV API listening on http://localhost:${PORT}`);
});
