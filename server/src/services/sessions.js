// starting, finding and ending sessions, and the cookie that goes with them
import { createHash, randomBytes } from 'node:crypto';
import { Session } from '../models/Session.js';

const SESSION_COOKIE = 'gv_session';
const DAY = 24 * 60 * 60 * 1000;
const SESSION_LENGTH = 30 * DAY;

/** a long random string nobody could guess. sessions use it, and so do invite links */
export function newToken() {
    return randomBytes(32).toString('base64url');
}

/** what gets saved in the database in place of a token */
export function hashToken(token) {
    return createHash('sha256').update(token).digest('hex');
}

function cookieOptions() {
    return {
        httpOnly: true,  // JavaScript on the page can't read it, so a bad script can't steal it
        sameSite: 'lax', // other websites can't make the browser send it along with their requests
        // https only. Vercel sets NODE_ENV to production. my laptop is plain http, so it's off there
        secure: process.env.NODE_ENV === 'production',
        path: '/'
    };
}

/** signs the account in on this browser */
export async function startSession(res, account) {
    const token = newToken();
    await Session.create({
        tokenHash: hashToken(token),
        account: account._id,
        expiresAt: new Date(Date.now() + SESSION_LENGTH)
    });
    res.cookie(SESSION_COOKIE, token, { ...cookieOptions(), maxAge: SESSION_LENGTH });
}

/** the session this request's cookie belongs to, or null */
export async function findSession(req) {
    const token = req.cookies?.[SESSION_COOKIE];
    if (typeof token !== 'string' || token === '') return null;

    const session = await Session.findOne({ tokenHash: hashToken(token) });
    // MongoDB only sweeps expired documents about once a minute, so one can still be sitting there
    if (session === null || session.expiresAt <= new Date()) return null;
    return session;
}

/** signs this browser out */
export async function endSession(req, res) {
    const token = req.cookies?.[SESSION_COOKIE];
    if (typeof token === 'string' && token !== '') {
        await Session.deleteOne({ tokenHash: hashToken(token) });
    }
    res.clearCookie(SESSION_COOKIE, cookieOptions());
}
