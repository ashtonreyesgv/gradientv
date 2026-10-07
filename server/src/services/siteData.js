// the things a client's own website sends to the portal (finished assessments,
// newsletter signups): checking them, saving them, and reading them back for the client.
// the controllers use this, and so does scripts/import-site-data.js, so a row
// brought over from an old database goes through the same checks as a new one
import { AssessmentResult, LABEL_MAX, RISK_LEVELS, TYPE_PATTERN } from '../models/AssessmentResult.js';
import { EMAIL_MAX, SOURCE_PATTERN, Subscriber } from '../models/Subscriber.js';
import { HttpError } from '../middleware/errorHandlers.js';

const DAY = 24 * 60 * 60 * 1000;
// "something @ something . something", no spaces. the real test of an address is whether mail arrives
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RECENT_RESULTS = 50;
const NEWEST_SUBSCRIBERS = 1000;
const DUPLICATE_KEY = 11000;

// -------------------- checking --------------------

/**
 * Checks one assessment result. Throws a 400 that says what is wrong with it.
 * @return {Object} the fields as the model names them
 */
export function cleanAssessment({ type, label, score, riskLevel } = {}) {
    if (typeof type !== 'string' || !TYPE_PATTERN.test(type)) {
        throw new HttpError(400, 'type has to be a short name like quick-check.');
    }
    if (!Number.isInteger(score) || score < 0 || score > 100) {
        throw new HttpError(400, 'score has to be a whole number from 0 to 100.');
    }
    if (!RISK_LEVELS.includes(riskLevel)) {
        throw new HttpError(400, `riskLevel has to be one of: ${RISK_LEVELS.join(', ')}.`);
    }
    if (label != null && (typeof label !== 'string' || label.trim().length > LABEL_MAX)) {
        throw new HttpError(400, `label has to be text, ${LABEL_MAX} characters at most.`);
    }
    return { assessmentType: type, label: label?.trim() || null, score, riskLevel };
}

/** Checks one newsletter signup. Throws a 400 when the email isn't one. */
export function cleanSubscriber({ email, sourcePage } = {}) {
    // lowercase first, so ' Colin@Example.COM ' and 'colin@example.com' can't become two rows
    const address = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (address.length > EMAIL_MAX || !EMAIL_PATTERN.test(address)) {
        throw new HttpError(400, 'email has to be an email address.');
    }
    // the page is nice to have. one that looks wrong gets dropped and the signup still counts
    const page = typeof sourcePage === 'string' && SOURCE_PATTERN.test(sourcePage) ? sourcePage : null;
    return { email: address, sourcePage: page };
}

// -------------------- saving --------------------

/**
 * Puts an address on a client's list.
 * @param {Date} when only the import passes this, to keep the day they really signed up
 * @return {Promise<boolean>} false when the address was already on the list
 */
export async function addSubscriber(account, { email, sourcePage }, when = new Date()) {
    try {
        // upsert: make the row only if there isn't one. $setOnInsert is skipped when there is,
        // so signing up again doesn't change the date or the page of the first time
        const result = await Subscriber.updateOne(
            { account: account._id, email },
            { $setOnInsert: { sourcePage, createdAt: when, updatedAt: when } },
            { upsert: true, timestamps: false }
        );
        return result.upsertedCount === 1;
    } catch (error) {
        // two signups for the same address at the same instant: one wins, the other lands here
        if (error.code === DUPLICATE_KEY) return false;
        throw error;
    }
}

/** how many of these the account got in the last 24 hours */
export function countToday(Model, account) {
    return Model.countDocuments({ account: account._id, createdAt: { $gt: new Date(Date.now() - DAY) } });
}

// -------------------- reading --------------------

/**
 * Everything the assessments card shows for one client.
 * @return {Promise<Object>} { total, last30, byType, recent }
 */
export async function summarizeAssessments(account) {
    const mine = { account: account._id };
    const oneIfRisk = (level) => ({ $sum: { $cond: [{ $eq: ['$riskLevel', level] }, 1, 0] } });

    const [groups, labels, recent, last30] = await Promise.all([
        // one row per assessment: how many, the average score, and how the risk levels split
        AssessmentResult.aggregate([
            { $match: mine },
            { $group: {
                _id: '$assessmentType',
                count: { $sum: 1 },
                averageScore: { $avg: '$score' },
                low: oneIfRisk('low'),
                medium: oneIfRisk('medium'),
                high: oneIfRisk('high')
            } },
            { $sort: { count: -1, _id: 1 } }
        ]),
        // the name each assessment was last sent with. rows from before names existed
        // don't have one, so this looks for the newest row that does
        AssessmentResult.aggregate([
            { $match: { ...mine, label: { $type: 'string' } } },
            { $sort: { createdAt: -1 } },
            { $group: { _id: '$assessmentType', label: { $first: '$label' } } }
        ]),
        AssessmentResult.find(mine).sort('-createdAt').limit(RECENT_RESULTS).lean(),
        AssessmentResult.countDocuments({ ...mine, createdAt: { $gt: new Date(Date.now() - 30 * DAY) } })
    ]);

    const labelFor = new Map(labels.map((row) => [row._id, row.label]));
    return {
        total: groups.reduce((sum, group) => sum + group.count, 0),
        last30,
        byType: groups.map((group) => ({
            type: group._id,
            label: labelFor.get(group._id) ?? null,
            count: group.count,
            averageScore: Math.round(group.averageScore),
            low: group.low,
            medium: group.medium,
            high: group.high
        })),
        recent
    };
}

/** @return {Promise<Object>} { total, subscribers } newest first. subscribers stops at 1,000 */
export async function listSubscribers(account) {
    const mine = { account: account._id };
    const [total, subscribers] = await Promise.all([
        Subscriber.countDocuments(mine),
        Subscriber.find(mine).sort('-createdAt').limit(NEWEST_SUBSCRIBERS).lean()
    ]);
    return { total, subscribers };
}
