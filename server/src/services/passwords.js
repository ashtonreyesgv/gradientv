// everything about passwords in one place
// a password is never saved. bcrypt scrambles it into a hash that can't be turned
// back, and signing in scrambles what was typed the same way and compares the two.
// so even someone who read the whole database wouldn't have anyone's password
import bcrypt from 'bcryptjs';
import { HttpError } from '../middleware/errorHandlers.js';

export const PASSWORD_MIN = 10;
// bcrypt only looks at the first 72 bytes, so anything longer would be quietly cut off
const PASSWORD_MAX_BYTES = 72;
// how much work one hash takes (2^12 rounds, about a quarter second). slow on purpose:
// nobody signing in notices, but guessing millions of passwords becomes hopeless
const ROUNDS = 12;

// the hash of a random string that was thrown away. see passwordMatches
const NOBODYS_HASH = '$2b$12$5dFMW8.nPhWTyweMMvc7eeMCQCYxhF.SVgOPDKIT3f74aH0ubDz0a';

/** throws a 400 with a readable reason when a new password won't do */
export function assertUsablePassword(password) {
    if (typeof password !== 'string' || password.length < PASSWORD_MIN) {
        throw new HttpError(400, `Use at least ${PASSWORD_MIN} characters for the password.`);
    }
    if (Buffer.byteLength(password) > PASSWORD_MAX_BYTES) {
        throw new HttpError(400, 'That password is too long. Keep it under 72 characters.');
    }
}

export function hashPassword(password) {
    return bcrypt.hash(password, ROUNDS);
}

/**
 * true when the password is the one behind the hash.
 * with no hash (no such account, or no password picked yet) it still does a full
 * comparison against a hash nobody has the password to. that way a wrong email
 * takes exactly as long to turn down as a wrong password, and the wait can't be
 * used to find out which emails are clients
 */
export async function passwordMatches(password, hash) {
    const matches = await bcrypt.compare(password, hash ?? NOBODYS_HASH);
    return hash ? matches : false;
}
