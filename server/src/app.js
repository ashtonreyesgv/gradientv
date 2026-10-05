// building the Express app (without starting it)
// two things start it: src/server.js on my laptop, and api/index.js on Vercel.
// that's why building and starting are separate files
//
// every request goes down this chain in order:
//   requestLogger    -> notes it, always passes it on
//   no-store         -> tells browsers and Vercel never to cache an answer
//   express.json     -> JSON bodies become req.body
//   cookieParser     -> the Cookie header becomes req.cookies
//   /api/health      -> is the server up, is the database up
//   /api/auth/...    -> signing in and out (requireDatabase goes first)
//   notFound         -> only reached if nothing above answered
//   errorHandler     -> reached whenever anything above threw
import cookieParser from 'cookie-parser';
import express from 'express';
import { connectDatabase, databaseIsUp } from './db.js';
import { errorHandler, notFound } from './middleware/errorHandlers.js';
import { requestLogger } from './middleware/requestLogger.js';
import { requireDatabase } from './middleware/requireDatabase.js';
import authRoutes from './routes/authRoutes.js';

export function createApp({ logRequests = true } = {}) {
    const app = express();

    if (logRequests) app.use(requestLogger);
    // everything the portal answers belongs to one client, so nothing should hang on to a copy
    app.use((req, res, next) => {
        res.set('Cache-Control', 'no-store');
        next();
    });
    app.use(express.json());
    app.use(cookieParser());

    // lets me tell "server is down" apart from "database is down".
    // it tries to connect first, so the answer is right even when Vercel just woke the server up
    app.get('/api/health', async (req, res) => {
        await connectDatabase().catch(() => null);
        res.json({ ok: true, database: databaseIsUp() });
    });
    app.use('/api/auth', requireDatabase, authRoutes);

    app.use(notFound);
    app.use(errorHandler);
    return app;
}
