// the bouncer for a client's website (requireAuth is the one for a client's browser).
// a site sends its key along in a header:
//     Authorization: Bearer gvsite_...
// this finds the account the key belongs to and leaves it on req.account.
//
// same rule as everywhere else: what a site sends is saved under the account its
// key belongs to. it can't name a different client, there's no field for that
import { HttpError } from './errorHandlers.js';
import { findBySiteKey } from '../services/accounts.js';

export async function requireSiteKey(req, res, next) {
    const [scheme, key] = (req.get('authorization') ?? '').split(' ');
    const account = scheme === 'Bearer' ? await findBySiteKey(key) : null;
    if (account === null) throw new HttpError(401, 'A valid site key is needed for this.');

    req.account = account;
    next();
}
