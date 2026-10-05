// one business that can sign in to the portal
// it's one login per business, so the business and its login are the same document.
// (if a client ever needs two people with their own passwords, the login fields
// move out into their own collection and point back here)
import mongoose from 'mongoose';

export const ROLES = ['client', 'admin'];

const accountSchema = new mongoose.Schema({
    businessName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
    // 'admin' is me. everyone else is a 'client' and only ever sees their own things
    role: { type: String, enum: ROLES, default: 'client' },
    // their site's project name on Vercel. the stats page asks Vercel about this project
    vercelProject: { type: String, default: null, trim: true },

    // never the password itself, only bcrypt's scrambled version of it.
    // null until they open their invite link and pick one
    passwordHash: { type: String, default: null },

    // the one-time link that lets them pick a password. only a hash of it is saved,
    // so reading the database isn't enough to use somebody's link
    inviteHash: { type: String, default: null },
    inviteExpiresAt: { type: Date, default: null },

    // wrong passwords in a row, and until when signing in is paused because of them
    failedLogins: { type: Number, default: 0 },
    lockedUntil: { type: Date, default: null }
}, { timestamps: true });

export const Account = mongoose.model('Account', accountSchema);
