// making accounts and their invite links
// scripts/add-client.js uses this today. the admin page will use the same function later
import { Account } from '../models/Account.js';
import { hashToken, newToken } from './sessions.js';

const DAY = 24 * 60 * 60 * 1000;
export const INVITE_DAYS = 7;

/**
 * Makes the account if the email is new, then gives it a fresh invite link.
 * For an email that already has an account it only swaps the link, which is how
 * a forgotten password gets fixed: the old password keeps working until they
 * use the new link.
 * @return {Promise<{ account: Object, token: string, isNew: boolean }>} token goes in the link. it is not saved anywhere
 */
export async function inviteAccount({ businessName, email, vercelProject, role }) {
    const token = newToken();
    const existing = await Account.findOne({ email: email.trim().toLowerCase() });
    const account = existing ?? new Account({ email });

    if (businessName) account.businessName = businessName;
    if (vercelProject) account.vercelProject = vercelProject;
    if (role) account.role = role;
    account.inviteHash = hashToken(token);
    account.inviteExpiresAt = new Date(Date.now() + INVITE_DAYS * DAY);
    await account.save();

    return { account, token, isNew: existing === null };
}

/** the account an invite link belongs to, or null when the link is wrong, used up, or too old */
export async function findInvited(token) {
    // a token must be plain text. anything else (like an object) could be read by Mongo as a query
    if (typeof token !== 'string' || token === '') return null;

    const account = await Account.findOne({ inviteHash: hashToken(token) });
    if (account === null || account.inviteExpiresAt <= new Date()) return null;
    return account;
}
