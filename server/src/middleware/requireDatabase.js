// everything about signing in needs MongoDB. if it can't be reached, answer
// one clear 503 here, so every route behind this doesn't fail in its own way.
// it's also what makes the login page say "not open yet" on a deployment
// that has no database set up
import { connectDatabase } from '../db.js';
import { HttpError } from './errorHandlers.js';

export async function requireDatabase(req, res, next) {
    try {
        await connectDatabase();
    } catch (error) {
        console.error(`No database: ${error.message}`);
        throw new HttpError(503, 'The client portal is not available right now.');
    }
    next();
}
