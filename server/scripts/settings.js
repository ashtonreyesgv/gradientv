// what every script in this folder starts with: which settings file, and so which database
//
// by itself a script uses the database on my laptop (server/.env), for testing.
// with --live it uses the real one, the one gradientv.com uses. --live reads
// server/.env.production in place of server/.env. that file holds the Atlas address
// (MONGODB_URI) and the real site's address (SITE_URL), and like .env it never gets committed
import dotenv from 'dotenv';
import mongoose from 'mongoose';

/** @return {boolean} true when the script was asked for the real database */
export function loadSettings(args) {
    const isLive = args.includes('--live');
    const settings = dotenv.config({ path: isLive ? '.env.production' : '.env', override: true, quiet: true });
    if (isLive && settings.error) {
        console.error('There is no server/.env.production yet. It needs two lines: MONGODB_URI (the Atlas address) and SITE_URL.');
        process.exit(1);
    }
    return isLive;
}

/**
 * call it right after connecting. it says which database out loud, so a test
 * never lands in the real one by accident. only the host gets printed: the full
 * address has the database password in it
 */
export function sayWhichDatabase(isLive) {
    console.log(`\nUsing the ${isLive ? 'LIVE database' : 'database on this laptop'} (${mongoose.connection.host}).`);
}
