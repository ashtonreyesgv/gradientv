// bringing a client's old rows over from the database their site used before
//
//   npm run import-site-data -- owner@example.com assessments "C:\Users\me\Downloads\assessment_results_rows.csv"
//   npm run import-site-data -- owner@example.com subscribers "C:\Users\me\Downloads\subscribers_rows.csv"
//
// the file is a CSV export of the old table (in Supabase: Table Editor > the table > Export > CSV).
// the columns it reads:
//   assessments   id, created_at, assessment_type, score, risk_level
//   subscribers   created_at, email, source_page
//
// old assessment rows only have the site's short name ('quick-check'), and the portal shows a
// proper one ('Casino Quick Check'). to give the old rows theirs, add a small JSON file after the CSV:
//
//   npm run import-site-data -- owner@example.com assessments "...rows.csv" "...assessment-names.json"
//
// it looks like { "quick-check": "Casino Quick Check", "full-assessment": "Casino Readiness Assessment" }.
// without it they still import, and get their name when the first new result of that kind comes in.
//
// by itself it only reads the file and says what it would do. add --save to do it.
// every row goes through the same checks as a new one. a row that fails is skipped and
// listed by its line number. it only ever adds: nothing already here is changed or removed,
// and running it twice doesn't double anything.
//
// add --live for the real database (settings.js is where --live is explained)
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import mongoose from 'mongoose';
import { connectDatabase } from '../src/db.js';
import { Account } from '../src/models/Account.js';
import { AssessmentResult } from '../src/models/AssessmentResult.js';
import { Subscriber } from '../src/models/Subscriber.js';
import { addSubscriber, cleanAssessment, cleanSubscriber } from '../src/services/siteData.js';
import { loadSettings, sayWhichDatabase } from './settings.js';

const KINDS = {
    assessments: { columns: ['id', 'created_at', 'assessment_type', 'score', 'risk_level'], add: addAssessment },
    subscribers: { columns: ['created_at', 'email', 'source_page'], add: addSignup }
};

const args = process.argv.slice(2);
const save = args.includes('--save');
const isLive = loadSettings(args);
const [email, kind, file, namesFile] = args.filter((arg) => !arg.startsWith('--'));

if (!/^\S+@\S+\.\S+$/.test(email ?? '') || !Object.hasOwn(KINDS, kind ?? '') || !file) {
    console.error('Usage: npm run import-site-data -- email@example.com assessments|subscribers "path to the .csv" ["path to names.json"] [--save] [--live]');
    process.exit(1);
}

// the proper names for old assessment rows, when a names file was given. filled in below
let names = {};

try {
    // npm runs this from inside server/. INIT_CWD is the folder the command was typed in,
    // so a path like .\rows.csv means what it looks like it means
    const read = (name) => readFile(path.resolve(process.env.INIT_CWD ?? process.cwd(), name), 'utf8');
    const text = await read(file);
    if (namesFile) names = JSON.parse(await read(namesFile));
    const rows = readCsv(text);
    const missing = KINDS[kind].columns.filter((column) => !rows.columns.includes(column));
    if (missing.length > 0) {
        throw new Error(`the file has no ${missing.join(', ')} column. Its columns are: ${rows.columns.join(', ')}`);
    }

    await connectDatabase();
    sayWhichDatabase(isLive);
    const account = await Account.findOne({ email: email.trim().toLowerCase() });
    if (account === null) throw new Error(`there is no login for ${email}. Make it first with npm run add-client`);

    let added = 0;
    let alreadyHere = 0;
    const skipped = [];
    for (const row of rows.list) {
        try {
            if (await KINDS[kind].add(account, row.values)) added++;
            else alreadyHere++;
        } catch (error) {
            // only the line number and the reason. the row itself (it may be somebody's email) stays out of the terminal
            skipped.push(`  line ${row.line}: ${error.message}`);
        }
    }

    console.log(`${rows.list.length} rows in the file, for ${account.businessName}.`);
    console.log(`  ${added} ${save ? 'added' : 'would be added'}`);
    console.log(`  ${alreadyHere} already here`);
    console.log(`  ${skipped.length} skipped`);
    if (skipped.length > 0) console.log(skipped.join('\n'));
    if (!save) console.log('\nNothing was saved. Run it again with --save at the end to do it.');
} catch (error) {
    console.error(`That didn't work: ${error.message}`);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}

// -------------------- one row --------------------
// each returns true when the row is new, false when it was already here

async function addAssessment(account, row) {
    if (row.id === '' || row.score.trim() === '') throw new Error('id or score is empty');
    const label = Object.hasOwn(names, row.assessment_type) ? names[row.assessment_type] : null;
    const fields = cleanAssessment({ type: row.assessment_type, label, score: Number(row.score), riskLevel: row.risk_level });
    const when = readDate(row.created_at);

    // the id the row had in the old database is what makes a second run recognise it
    const itsOldId = { account: account._id, importedId: String(row.id) };
    if (!save) return await AssessmentResult.exists(itsOldId) === null;

    const result = await AssessmentResult.updateOne(
        itsOldId,
        { $setOnInsert: { ...fields, createdAt: when, updatedAt: when } },
        { upsert: true, timestamps: false }
    );
    return result.upsertedCount === 1;
}

async function addSignup(account, row) {
    const fields = cleanSubscriber({ email: row.email, sourcePage: row.source_page });
    const when = readDate(row.created_at);

    if (!save) return await Subscriber.exists({ account: account._id, email: fields.email }) === null;
    return addSubscriber(account, fields, when);
}

// -------------------- helpers --------------------

/**
 * Postgres writes '2026-07-30 03:00:19.123456+00'. JavaScript wants
 * '2026-07-30T03:00:19.123+00:00': a T in the middle, three decimals, and a full time zone
 */
function readDate(text) {
    const iso = text.trim()
        .replace(' ', 'T')
        .replace(/(\.\d{3})\d+/, '$1')
        .replace(/(:\d{2}(?:\.\d+)?[+-]\d{2})$/, '$1:00');
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) throw new Error('created_at is not a date');
    return date;
}

/**
 * A small CSV reader. It knows the two things that make CSV awkward:
 * a "quoted field" can have commas and line breaks in it, and "" inside one means a quote.
 * @return {{ columns: string[], list: { line: number, values: Object }[] }}
 */
function readCsv(text) {
    const table = [];
    let row = [];
    let field = '';
    let quoted = false;
    // some programs put an invisible mark at the very start of the file. it isn't part of the first column's name
    const clean = text.replace(/^\uFEFF/, '');

    for (let i = 0; i < clean.length; i++) {
        const char = clean[i];
        if (quoted) {
            if (char === '"' && clean[i + 1] === '"') { field += '"'; i++; }
            else if (char === '"') quoted = false;
            else field += char;
        } else if (char === '"') {
            quoted = true;
        } else if (char === ',') {
            row.push(field);
            field = '';
        } else if (char === '\n') {
            row.push(field);
            table.push(row);
            row = [];
            field = '';
        } else if (char !== '\r') {
            field += char;
        }
    }
    if (field !== '' || row.length > 0) {
        row.push(field);
        table.push(row);
    }

    const [columns = [], ...lines] = table;
    const list = lines
        .map((cells, i) => ({ line: i + 2, cells })) // + 2: the header is line 1
        .filter(({ cells }) => cells.some((cell) => cell !== ''))
        .map(({ line, cells }) => ({ line, values: Object.fromEntries(columns.map((column, c) => [column, cells[c] ?? ''])) }));
    return { columns, list };
}
