// the one MongoDB connection, shared by everything on the server.
//
// on my laptop the server starts once and stays up, so "connect once" is obvious.
// on Vercel the server is a function: it wakes up for a request, stays warm for a
// while, and gets reused for the next ones. whatever is saved at the top of a file
// survives between those requests, so the connection is kept here and every request
// after the first reuses it instead of opening a new one (Atlas only allows so many)
import mongoose from 'mongoose';

let connecting = null;

/** connects the first time it's called. after that it hands back the same connection */
export function connectDatabase() {
    const uri = process.env.MONGODB_URI;
    if (!uri) return Promise.reject(new Error('MONGODB_URI is not set.'));

    if (!connecting) {
        connecting = mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 }).catch((error) => {
            // forget the failed try, so the next request gets a fresh one
            connecting = null;
            throw error;
        });
    }
    return connecting;
}

/** true when a query would work right now */
export function databaseIsUp() {
    return mongoose.connection.readyState === 1;
}
