// one signed-in browser
// signing in makes one of these and hands the browser a long random token in a
// cookie. every request after that shows the cookie, and the server looks up which
// session it belongs to. signing out deletes the document, and then the cookie
// means nothing. that's the whole trick: the browser never holds anything but a ticket
import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    // a hash of the token, not the token. the browser has the only real copy
    tokenHash: { type: String, required: true, unique: true },
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    // "expires: 0" makes this a TTL index: MongoDB deletes the document by itself once this time passes
    expiresAt: { type: Date, required: true, expires: 0 }
}, { timestamps: true });

export const Session = mongoose.model('Session', sessionSchema);
