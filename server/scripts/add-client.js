// making a client's login from the terminal
//
//   npm run add-client -- "Bukas Cafe" owner@bukascafe.com bukascafe
//
// the last one is their site's project name on Vercel, for the stats page. it's optional.
// add --admin to make a login for me instead of for a client.
//
// it prints a link. send that to the client: it lets them pick their own password,
// it works once, and it stops working after 7 days. i never see or pick their password.
// running this again with the same email makes a fresh link, which is also how a
// forgotten password gets fixed
//
// by itself this makes the login in the database on my laptop, for testing.
// add --live to make it in the real one (Atlas), the one gradientv.com uses:
//
//   npm run add-client -- "Bukas Cafe" owner@bukascafe.com bukascafe --live
//
// --live reads server/.env.production in place of server/.env. that file holds the
// Atlas address (MONGODB_URI) and the real site's address (SITE_URL), and like .env it never gets committed
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDatabase } from '../src/db.js';
import { INVITE_DAYS, inviteAccount } from '../src/services/accounts.js';

const args = process.argv.slice(2);
const isAdmin = args.includes('--admin');
const isLive = args.includes('--live');

const settings = dotenv.config({ path: isLive ? '.env.production' : '.env', override: true, quiet: true });
if (isLive && settings.error) {
    console.error('There is no server/.env.production yet. It needs two lines: MONGODB_URI (the Atlas address) and SITE_URL.');
    process.exit(1);
}
const [businessName, email, vercelProject] = args.filter((arg) => !arg.startsWith('--'));

if (!businessName || !/^\S+@\S+\.\S+$/.test(email ?? '')) {
    console.error('Usage: npm run add-client -- "Business name" email@example.com [vercel-project] [--admin] [--live]');
    process.exit(1);
}

// where the portal lives, for the link. my laptop unless .env says otherwise
const SITE_URL = (process.env.SITE_URL ?? 'http://localhost:5173').replace(/\/$/, '');

try {
    await connectDatabase();
    // say which database out loud, so a test login never lands in the real one by accident.
    // only the host gets printed. the full address has the database password in it
    console.log(`\nUsing the ${isLive ? 'LIVE database' : 'database on this laptop'} (${mongoose.connection.host}).`);

    const { account, token, isNew } = await inviteAccount({
        businessName,
        email,
        vercelProject,
        role: isAdmin ? 'admin' : undefined
    });

    console.log(isNew ? `Made a login for ${account.businessName} (${account.email}).` : `${account.email} already had a login. Here is a fresh link for it.`);
    console.log(`\nSend them this. It works once, for ${INVITE_DAYS} days:\n`);
    // the token goes after a # so it never reaches a server log. the page reads it from there
    console.log(`  ${SITE_URL}/set-password#${token}\n`);
} catch (error) {
    console.error(`That didn't work: ${error.message}`);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}
