// making the key a client's website uses to send things to the portal
//
//   npm run site-key -- owner@inforeportingsolutions.com
//
// the login has to be there already (npm run add-client). this prints the key, once.
// it goes in that client's own project on Vercel as PORTAL_SITE_KEY and nowhere else:
// not in their site's code, not in a browser. only a hash of it is saved here, so
// a lost key can't be looked up. make a new one instead.
//
// a login that already has a key keeps it unless --replace is added. the old key
// stops working that second, so their site saves nothing until the new one is in Vercel.
//
// add --live for the real database (settings.js is where --live is explained)
import mongoose from 'mongoose';
import { connectDatabase } from '../src/db.js';
import { giveSiteKey } from '../src/services/accounts.js';
import { loadSettings, sayWhichDatabase } from './settings.js';

const args = process.argv.slice(2);
const replace = args.includes('--replace');
const isLive = loadSettings(args);
const [email] = args.filter((arg) => !arg.startsWith('--'));

if (!/^\S+@\S+\.\S+$/.test(email ?? '')) {
    console.error('Usage: npm run site-key -- email@example.com [--replace] [--live]');
    process.exit(1);
}

try {
    await connectDatabase();
    sayWhichDatabase(isLive);

    const { account, key, hadKey } = await giveSiteKey(email, { replace });

    if (account === null) {
        console.error(`There is no login for ${email}. Make it first with npm run add-client.`);
        process.exitCode = 1;
    } else if (key === null) {
        console.error(`${account.businessName} already has a site key. Add --replace to make a new one.`);
        console.error('The old key stops working right away, so their site saves nothing until the new one is in Vercel.');
        process.exitCode = 1;
    } else {
        console.log(hadKey ? `Replaced the site key for ${account.businessName}. The old one no longer works.` : `Made a site key for ${account.businessName}.`);
        console.log('\nThis is the only time it is shown:\n');
        console.log(`  ${key}\n`);
        console.log("It goes in that client's project on Vercel: Settings > Environment Variables > PORTAL_SITE_KEY.");
        console.log('Then redeploy their site so it picks the key up.\n');
    }
} catch (error) {
    console.error(`That didn't work: ${error.message}`);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}
