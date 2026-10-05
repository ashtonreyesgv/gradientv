// the controllers for signing in and out
// each function answers one kind of request: read what it needs from req,
// ask the models, send back a DTO. none of them catch errors (see errorHandlers)
import { Account } from '../models/Account.js';
import { Session } from '../models/Session.js';
import { toAccountJSON, toInviteJSON } from '../dto/accountDTO.js';
import { HttpError } from '../middleware/errorHandlers.js';
import { findInvited } from '../services/accounts.js';
import { assertUsablePassword, hashPassword, passwordMatches } from '../services/passwords.js';
import { endSession, startSession } from '../services/sessions.js';

const MAX_TRIES = 5;
const LOCK_MINUTES = 15;

/** POST /api/auth/login { email, password } -> the account, plus the session cookie */
export async function login(req, res) {
    const { email, password } = req.body ?? {};
    // both have to be plain text. an object here could be read by Mongo as a query instead of a value
    if (typeof email !== 'string' || typeof password !== 'string') {
        throw new HttpError(400, 'Send an email and a password.');
    }

    const account = await Account.findOne({ email: email.trim().toLowerCase() });

    if (account?.lockedUntil && account.lockedUntil > new Date()) {
        throw new HttpError(429, `Too many wrong passwords. Try again in ${LOCK_MINUTES} minutes.`);
    }

    if (!await passwordMatches(password, account?.passwordHash)) {
        if (account) await countWrongPassword(account);
        // the same words for a wrong email and a wrong password, so this can't be used to check who is a client
        throw new HttpError(401, 'That email and password do not match.');
    }

    account.failedLogins = 0;
    account.lockedUntil = null;
    await account.save();

    await startSession(res, account);
    res.json(toAccountJSON(account));
}

/** POST /api/auth/logout -> ends this browser's session */
export async function logout(req, res) {
    await endSession(req, res);
    res.status(204).end();
}

/** GET /api/auth/me -> whoever is signed in (requireAuth already found them) */
export async function me(req, res) {
    res.json(toAccountJSON(req.account));
}

/**
 * POST /api/auth/invite { token } -> whose login an invite link is for
 * it's a POST so the token rides in the body. in a URL it would end up in the request log
 */
export async function getInvite(req, res) {
    const account = await requireInvited(req.body?.token);
    res.json(toInviteJSON(account));
}

/** POST /api/auth/set-password { token, password } -> saves the password, uses up the link, signs them in */
export async function setPassword(req, res) {
    const account = await requireInvited(req.body?.token);
    assertUsablePassword(req.body.password);

    account.passwordHash = await hashPassword(req.body.password);
    account.inviteHash = null;
    account.inviteExpiresAt = null;
    account.failedLogins = 0;
    account.lockedUntil = null;
    await account.save();

    // a new password signs out every browser that was using the old one
    await Session.deleteMany({ account: account._id });
    await startSession(res, account);
    res.json(toAccountJSON(account));
}

// -------------------- helpers --------------------
async function requireInvited(token) {
    const account = await findInvited(token);
    if (account === null) throw new HttpError(404, 'This link does not work anymore. Ask us for a new one.');
    return account;
}

// five wrong passwords in a row pauses the account for a while, so nobody can sit there guessing
async function countWrongPassword(account) {
    account.failedLogins += 1;
    if (account.failedLogins >= MAX_TRIES) {
        account.failedLogins = 0;
        account.lockedUntil = new Date(Date.now() + LOCK_MINUTES * 60 * 1000);
    }
    await account.save();
}
