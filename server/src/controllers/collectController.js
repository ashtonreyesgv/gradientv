// the controllers a client's website talks to
// every one of these runs behind requireSiteKey, so req.account is the client the
// key belongs to. the website on the other end already checked what its visitor
// sent. it gets checked again here anyway: this is the last stop before the database
import { AssessmentResult } from '../models/AssessmentResult.js';
import { Subscriber } from '../models/Subscriber.js';
import { HttpError } from '../middleware/errorHandlers.js';
import { addSubscriber, cleanAssessment, cleanSubscriber, countToday } from '../services/siteData.js';

// far more than a real day brings, and it stops a bot hammering a client's form
// from filling the database (the free one holds 512 MB, shared by every client)
const MAX_PER_DAY = 500;

async function stopFloods(Model, account) {
    if (await countToday(Model, account) >= MAX_PER_DAY) {
        throw new HttpError(429, 'That is more than a day normally brings. Nothing more is saved until tomorrow.');
    }
}

/** POST /api/collect/assessment { type, score, riskLevel, label? } */
export async function collectAssessment(req, res) {
    const result = cleanAssessment(req.body);
    await stopFloods(AssessmentResult, req.account);

    await AssessmentResult.create({ account: req.account._id, ...result });
    res.status(201).json({ ok: true });
}

/** POST /api/collect/subscriber { email, sourcePage? } */
export async function collectSubscriber(req, res) {
    const subscriber = cleanSubscriber(req.body);
    await stopFloods(Subscriber, req.account);

    // the answer is the same whether the address was new or already on the list
    await addSubscriber(req.account, subscriber);
    res.status(201).json({ ok: true });
}
