// the bouncer. put it in front of any route only a signed-in client may use:
//     router.get('/me', requireAuth, me);
// it finds the session the cookie belongs to and leaves the account on req.account.
//
// this is also what keeps clients out of each other's things: a route never asks
// the browser which client it is. it reads req.account, which only this file sets
import { Account } from '../models/Account.js';
import { findSession } from '../services/sessions.js';
import { HttpError } from './errorHandlers.js';

export async function requireAuth(req, res, next) {
    const session = await findSession(req);
    const account = session && await Account.findById(session.account);
    if (!account) throw new HttpError(401, 'Sign in to see this.');

    req.account = account;
    next();
}

/** goes after requireAuth, on the routes only i may use. a client gets a 403: signed in, but not allowed */
export function requireAdmin(req, res, next) {
    if (req.account.role !== 'admin') throw new HttpError(403, 'Only GradientV can do that.');
    next();
}
